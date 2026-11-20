import type { ChaosConfig, DistributedTrace, MeshEdge, MeshNode } from '../types/mesh';

export function tickMeshTelemetry(
  nodes: MeshNode[],
  edges: MeshEdge[],
  chaos: ChaosConfig
): { nodes: MeshNode[]; edges: MeshEdge[] } {
  const nextNodes = nodes.map((node) => {
    const isTargeted = chaos.targetServiceId === null || chaos.targetServiceId === node.id;
    const jitter = (Math.random() - 0.48) * 0.14;
    const baseRps = Math.max(80, Math.round(node.rps * (1 + jitter * 0.25) * chaos.trafficMultiplier));

    if (node.circuit === 'OPEN') {
      return {
        ...node,
        rps: 0,
        p99Ms: 1,
        errorRate: 100,
        cpuPct: Math.max(8, Math.round(node.cpuPct * 0.7)),
      };
    }

    const extraLatency = isTargeted ? chaos.injectedLatencyMs : 0;
    const extraError = isTargeted ? chaos.packetLossPct : 0;

    const nextP50 = Math.max(2, Math.round(node.p50Ms * (1 + jitter * 0.3) + extraLatency * 0.55));
    const nextP99 = Math.max(nextP50 + 4, Math.round(node.p99Ms * (1 + jitter * 0.4) + extraLatency));
    const nextErr = Number(Math.min(99.9, Math.max(0.01, node.errorRate + jitter * 0.2 + extraError)).toFixed(2));
    const nextCpu = Math.min(99, Math.max(12, Math.round(node.cpuPct * (0.94 + chaos.trafficMultiplier * 0.06) + jitter * 18)));

    return {
      ...node,
      rps: baseRps,
      p50Ms: nextP50,
      p99Ms: nextP99,
      errorRate: nextErr,
      cpuPct: nextCpu,
    };
  });

  const nodeMap = new Map(nextNodes.map((n) => [n.id, n]));

  const nextEdges = edges.map((edge) => {
    const targetNode = nodeMap.get(edge.target);
    if (!targetNode) return edge;
    return {
      ...edge,
      rps: targetNode.circuit === 'OPEN' ? 0 : Math.round(edge.rps * chaos.trafficMultiplier),
      latencyMs: targetNode.circuit === 'OPEN' ? 0 : Math.max(1, Math.round(targetNode.p50Ms * 0.65)),
      errorPct: targetNode.errorRate,
    };
  });

  return { nodes: nextNodes, edges: nextEdges };
}

export function synthesizeLiveTrace(nodes: MeshNode[]): DistributedTrace {
  const gw = nodes.find((n) => n.id === 'edge-gateway') ?? nodes[0];
  const auth = nodes.find((n) => n.id === 'auth-service') ?? nodes[1];
  const orch = nodes.find((n) => n.id === 'checkout-orchestrator') ?? nodes[2];
  const ledger = nodes.find((n) => n.id === 'ledger-service') ?? nodes[3];
  const db = nodes.find((n) => n.id === 'postgres-primary') ?? nodes[4];

  const ledgerFailed = ledger.circuit === 'OPEN' || ledger.errorRate > 12;
  const authDur = Math.max(6, auth.p50Ms + Math.round(Math.random() * 12));
  const dbDur = Math.max(4, db.p99Ms);
  const ledgerDur = ledgerFailed ? 18 : Math.max(15, ledger.p99Ms);
  const orchDur = ledgerDur + dbDur + 19;
  const totalMs = authDur + orchDur + 12;

  const traceId = `tr-${Math.random().toString(16).slice(2, 14)}`;
  const now = new Date().toISOString().split('T')[1].replace('Z', ' UTC');

  return {
    traceId,
    rootEndpoint: 'POST /v2/checkout/capture',
    timestamp: now,
    totalDurationMs: totalMs,
    hasError: ledgerFailed,
    spans: [
      {
        spanId: 'sp-live-1',
        serviceId: gw.id,
        serviceName: gw.name,
        operation: 'ingress.http_proxy',
        startOffsetMs: 0,
        durationMs: totalMs,
        status: ledgerFailed ? 'ERROR' : 'OK',
        protocol: 'HTTP/2',
        tags: { 'http.status_code': ledgerFailed ? '503' : '200' },
      },
      {
        spanId: 'sp-live-2',
        serviceId: auth.id,
        serviceName: auth.name,
        operation: 'grpc.IntrospectToken',
        startOffsetMs: 5,
        durationMs: authDur,
        status: 'OK',
        protocol: 'gRPC',
        tags: { 'region': auth.region },
      },
      {
        spanId: 'sp-live-3',
        serviceId: orch.id,
        serviceName: orch.name,
        operation: 'workflow.ExecutePayment',
        startOffsetMs: 5 + authDur,
        durationMs: orchDur,
        status: ledgerFailed ? 'ERROR' : 'OK',
        protocol: 'HTTP/2',
        tags: { 'attempt': '1' },
      },
      {
        spanId: 'sp-live-4',
        serviceId: ledger.id,
        serviceName: ledger.name,
        operation: 'grpc.PostJournalEntry',
        startOffsetMs: 12 + authDur,
        durationMs: ledgerDur,
        status: ledgerFailed ? 'ERROR' : ledgerDur > 150 ? 'WARN' : 'OK',
        protocol: 'gRPC',
        tags: { 'circuit.state': ledger.circuit },
      },
      {
        spanId: 'sp-live-5',
        serviceId: db.id,
        serviceName: db.name,
        operation: 'sql.COMMIT TRANSACTION',
        startOffsetMs: 18 + authDur,
        durationMs: dbDur,
        status: 'OK',
        protocol: 'TCP',
        tags: { 'db.name': 'ledger_prod' },
      },
    ],
  };
}

export function calculateMeshHealthScore(nodes: MeshNode[]): {
  availabilityPct: number;
  totalRps: number;
  avgP99Ms: number;
  openCircuits: number;
} {
  const totalRps = nodes.reduce((acc, n) => acc + n.rps, 0);
  const avgError = nodes.reduce((acc, n) => acc + n.errorRate, 0) / Math.max(1, nodes.length);
  const avgP99Ms = Math.round(nodes.reduce((acc, n) => acc + n.p99Ms, 0) / Math.max(1, nodes.length));
  const openCircuits = nodes.filter((n) => n.circuit === 'OPEN').length;
  const availabilityPct = Number(Math.max(0, 100 - avgError).toFixed(3));

  return { availabilityPct, totalRps, avgP99Ms, openCircuits };
}
