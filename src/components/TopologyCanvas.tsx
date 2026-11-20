import { MeshEdge, MeshNode } from '../types/mesh';

interface Props {
  nodes: MeshNode[];
  edges: MeshEdge[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}

export function TopologyCanvas({ nodes, edges, selectedNodeId, onSelectNode }: Props) {
  const nodeLookup = new Map(nodes.map((n) => [n.id, n]));

  const getNodeStroke = (node: MeshNode) => {
    if (node.circuit === 'OPEN') return '#f43f5e';
    if (node.circuit === 'HALF_OPEN' || node.errorRate > 2) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Interactive Service Dependency Graph</h2>
          <p className="text-xs text-zinc-400">Click any microservice node to inspect pod saturation &amp; downstream edges</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Healthy</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Degraded</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Circuit Open</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-zinc-800/80 bg-zinc-950">
        <svg viewBox="0 0 960 440" className="w-full h-[410px] select-none">
          <defs>
            <pattern id="mesh-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#18181b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="960" height="440" fill="url(#mesh-grid)" />

          {edges.map((edge) => {
            const src = nodeLookup.get(edge.source);
            const dst = nodeLookup.get(edge.target);
            if (!src || !dst) return null;

            const x1 = src.x + 85;
            const y1 = src.y + 32;
            const x2 = dst.x + 85;
            const y2 = dst.y + 32;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const isBroken = dst.circuit === 'OPEN' || edge.errorPct > 5;

            return (
              <g key={edge.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isBroken ? '#f43f5e' : '#6d28d9'}
                  strokeWidth={isBroken ? 2.5 : 2}
                  strokeDasharray={edge.protocol === 'Kafka' ? '6 4' : undefined}
                />
                <rect x={midX - 42} y={midY - 12} width="84" height="22" rx="4" fill="#09090b" stroke="#27272a" />
                <text x={midX} y={midY + 3} textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                  {edge.protocol} &bull; {edge.latencyMs}ms
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const ringColor = getNodeStroke(node);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode(node.id)}
                className="cursor-pointer"
              >
                <rect
                  width="170"
                  height="64"
                  rx="10"
                  fill={isSelected ? '#1e1b4b' : '#18181b'}
                  stroke={isSelected ? '#8b5cf6' : ringColor}
                  strokeWidth={isSelected ? 2.5 : 1.6}
                />
                <circle cx="14" cy="18" r="4.5" fill={ringColor} />
                <text x="25" y="21" fill="#f4f4f5" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {node.name}
                </text>
                <text x="14" y="40" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                  {node.rps} rps &bull; P99 {node.p99Ms}ms
                </text>
                <text x="14" y="54" fill={ringColor} fontSize="10" fontFamily="monospace">
                  ERR {node.errorRate}% [{node.circuit}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
