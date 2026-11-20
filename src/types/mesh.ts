export type ServiceTier = 'edge' | 'core' | 'data' | 'async';
export type CircuitState = 'CLOSED' | 'HALF_OPEN' | 'OPEN';
export type ViewTab = 'topology' | 'traces' | 'breakers' | 'chaos';

export interface MeshNode {
  id: string;
  name: string;
  tier: ServiceTier;
  region: string;
  rps: number;
  p50Ms: number;
  p99Ms: number;
  errorRate: number;
  cpuPct: number;
  memoryMb: number;
  circuit: CircuitState;
  x: number;
  y: number;
}

export interface MeshEdge {
  id: string;
  source: string;
  target: string;
  protocol: 'gRPC' | 'HTTP/2' | 'Kafka' | 'TCP';
  rps: number;
  latencyMs: number;
  errorPct: number;
}

export interface TraceSpan {
  spanId: string;
  serviceId: string;
  serviceName: string;
  operation: string;
  startOffsetMs: number;
  durationMs: number;
  status: 'OK' | 'WARN' | 'ERROR';
  protocol: string;
  tags: Record<string, string>;
}

export interface DistributedTrace {
  traceId: string;
  rootEndpoint: string;
  timestamp: string;
  totalDurationMs: number;
  hasError: boolean;
  spans: TraceSpan[];
}

export interface ChaosConfig {
  trafficMultiplier: number;
  injectedLatencyMs: number;
  packetLossPct: number;
  targetServiceId: string | null;
}
