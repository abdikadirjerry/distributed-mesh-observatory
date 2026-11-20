import { Cpu, HardDrive, ShieldAlert } from 'lucide-react';
import { CircuitState, MeshEdge, MeshNode } from '../types/mesh';

interface Props {
  node: MeshNode;
  edges: MeshEdge[];
  onChangeCircuit: (nodeId: string, state: CircuitState) => void;
}

export function NodeInspectorPanel({ node, edges, onChangeCircuit }: Props) {
  const upstream = edges.filter((e) => e.target === node.id);
  const downstream = edges.filter((e) => e.source === node.id);

  return (
    <aside className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 flex flex-col gap-5">
      <div className="border-b border-zinc-800 pb-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
            tier: {node.tier}
          </span>
          <span className="text-xs font-mono text-zinc-400">{node.region}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold font-mono text-zinc-100">{node.name}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
          <div className="text-zinc-500">P50 / P99 LATENCY</div>
          <div className="mt-1 text-sm font-bold text-zinc-100">
            {node.p50Ms}ms / <span className="text-violet-400">{node.p99Ms}ms</span>
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800">
          <div className="text-zinc-500">ERROR BUDGET</div>
          <div className={`mt-1 text-sm font-bold ${node.errorRate > 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {node.errorRate}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" /> CPU Utilization</span>
            <span>{node.cpuPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all ${node.cpuPct > 80 ? 'bg-rose-500' : 'bg-violet-500'}`}
              style={{ width: `${node.cpuPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5" /> RSS Memory</span>
            <span>{node.memoryMb} MB</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(100, Math.round((node.memoryMb / 8192) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-3.5">
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 mb-2">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400" /> Circuit Breaker Override
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['CLOSED', 'HALF_OPEN', 'OPEN'] as CircuitState[]).map((state) => (
            <button
              key={state}
              onClick={() => onChangeCircuit(node.id, state)}
              className={`py-1.5 rounded text-[11px] font-mono font-semibold border cursor-pointer ${
                node.circuit === state
                  ? 'bg-violet-600 border-violet-400 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-3 text-xs font-mono text-zinc-400 space-y-1">
        <div>Inbound Dependencies: <strong className="text-zinc-200">{upstream.length}</strong></div>
        <div>Outbound Dependencies: <strong className="text-zinc-200">{downstream.length}</strong></div>
      </div>
    </aside>
  );
}
