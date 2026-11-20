import { Flame } from 'lucide-react';
import { ChaosConfig, MeshNode } from '../types/mesh';

interface Props {
  nodes: MeshNode[];
  chaos: ChaosConfig;
  onUpdateChaos: (next: ChaosConfig) => void;
}

export function ChaosLabPanel({ nodes, chaos, onUpdateChaos }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 max-w-3xl space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="h-9 w-9 rounded-lg bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-100">Fault Injection &amp; Load Multiplier Lab</h2>
          <p className="text-xs text-zinc-400">Simulate regional traffic surges, artificial network delay, and upstream packet loss</p>
        </div>
      </div>

      <div className="space-y-5 font-mono text-xs">
        <div>
          <label className="block text-zinc-300 mb-2">Target Fault Scope</label>
          <select
            value={chaos.targetServiceId ?? 'ALL'}
            onChange={(e) =>
              onUpdateChaos({
                ...chaos,
                targetServiceId: e.target.value === 'ALL' ? null : e.target.value,
              })
            }
            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100"
          >
            <option value="ALL">Entire Service Mesh (Global Blast Radius)</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                Isolated Workload: {n.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-zinc-300 mb-1.5">
            <span>Ingress Traffic Multiplier</span>
            <span className="text-violet-400 font-bold">{chaos.trafficMultiplier.toFixed(1)}x RPS</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.5"
            value={chaos.trafficMultiplier}
            onChange={(e) => onUpdateChaos({ ...chaos, trafficMultiplier: parseFloat(e.target.value) })}
            className="w-full accent-violet-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-zinc-300 mb-1.5">
            <span>Injected Network Latency</span>
            <span className="text-amber-400 font-bold">+{chaos.injectedLatencyMs} ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="25"
            value={chaos.injectedLatencyMs}
            onChange={(e) => onUpdateChaos({ ...chaos, injectedLatencyMs: parseInt(e.target.value, 10) })}
            className="w-full accent-amber-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-zinc-300 mb-1.5">
            <span>Injected HTTP 5xx / Packet Loss</span>
            <span className="text-rose-400 font-bold">{chaos.packetLossPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="45"
            step="5"
            value={chaos.packetLossPct}
            onChange={(e) => onUpdateChaos({ ...chaos, packetLossPct: parseInt(e.target.value, 10) })}
            className="w-full accent-rose-500"
          />
        </div>
      </div>
    </div>
  );
}
