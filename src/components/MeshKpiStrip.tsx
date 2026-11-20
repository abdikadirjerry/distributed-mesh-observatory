import { calculateMeshHealthScore } from '../engine/telemetrySimulator';
import { MeshNode } from '../types/mesh';

interface Props {
  nodes: MeshNode[];
}

export function MeshKpiStrip({ nodes }: Props) {
  const { availabilityPct, totalRps, avgP99Ms, openCircuits } = calculateMeshHealthScore(nodes);

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Mesh Availability</div>
        <div className={`mt-1 text-2xl font-bold font-mono ${availabilityPct >= 99 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {availabilityPct}%
        </div>
        <div className="mt-1 text-xs text-zinc-500">SLO Target: 99.900%</div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Aggregate Throughput</div>
        <div className="mt-1 text-2xl font-bold font-mono text-violet-400">
          {totalRps.toLocaleString()} <span className="text-sm font-normal text-zinc-400">req/s</span>
        </div>
        <div className="mt-1 text-xs text-zinc-500">Across {nodes.length} active workloads</div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Mean P99 Latency</div>
        <div className={`mt-1 text-2xl font-bold font-mono ${avgP99Ms > 180 ? 'text-amber-400' : 'text-zinc-100'}`}>
          {avgP99Ms} ms
        </div>
        <div className="mt-1 text-xs text-zinc-500">Tail latency budget: 200 ms</div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Tripped Circuits</div>
        <div className={`mt-1 text-2xl font-bold font-mono ${openCircuits > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          {openCircuits} <span className="text-sm font-normal text-zinc-400">/ {nodes.length}</span>
        </div>
        <div className="mt-1 text-xs text-zinc-500">Envoy outlier detection active</div>
      </div>
    </section>
  );
}
