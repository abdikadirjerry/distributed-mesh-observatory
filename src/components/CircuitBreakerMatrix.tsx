import { CircuitState, MeshNode } from '../types/mesh';

interface Props {
  nodes: MeshNode[];
  onChangeCircuit: (nodeId: string, state: CircuitState) => void;
}

export function CircuitBreakerMatrix({ nodes, onChangeCircuit }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-100">Envoy Outlier Detection &amp; Circuit Breaker Matrix</h2>
        <p className="text-xs text-zinc-400">Isolate failing upstreams immediately or place degraded services into HALF_OPEN canary probing</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase">
              <th className="py-3 px-4">Workload</th>
              <th className="py-3 px-4">Tier</th>
              <th className="py-3 px-4">Throughput</th>
              <th className="py-3 px-4">P99 Latency</th>
              <th className="py-3 px-4">Error Rate</th>
              <th className="py-3 px-4">Current State</th>
              <th className="py-3 px-4">Manual Transition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {nodes.map((node) => (
              <tr key={node.id} className="hover:bg-zinc-800/30">
                <td className="py-3 px-4 font-bold text-zinc-100">{node.name}</td>
                <td className="py-3 px-4 text-zinc-400">{node.tier}</td>
                <td className="py-3 px-4 text-violet-300">{node.rps} rps</td>
                <td className="py-3 px-4 text-zinc-200">{node.p99Ms} ms</td>
                <td className={`py-3 px-4 font-bold ${node.errorRate > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {node.errorRate}%
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded border ${
                      node.circuit === 'OPEN'
                        ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                        : node.circuit === 'HALF_OPEN'
                        ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                        : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    {node.circuit}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1.5">
                    {(['CLOSED', 'HALF_OPEN', 'OPEN'] as CircuitState[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => onChangeCircuit(node.id, st)}
                        className={`px-2 py-1 rounded border cursor-pointer ${
                          node.circuit === st
                            ? 'bg-violet-600 border-violet-400 text-white'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
