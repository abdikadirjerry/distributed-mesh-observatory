import { Activity, Pause, Play, RotateCcw } from 'lucide-react';
import type { ViewTab } from '../types/mesh';

interface Props {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  isStreaming: boolean;
  onToggleStream: () => void;
  onReset: () => void;
}

const TABS: { id: ViewTab; label: string }[] = [
  { id: 'topology', label: 'Topology Map' },
  { id: 'traces', label: 'Trace Waterfall' },
  { id: 'breakers', label: 'Circuit Breakers' },
  { id: 'chaos', label: 'Chaos & Load Lab' },
];

export function TopObservatoryBar({
  activeTab,
  onSelectTab,
  isStreaming,
  onToggleStream,
  onReset,
}: Props) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wider uppercase text-zinc-100">
            AetherMesh <span className="text-violet-400">//</span> Distributed Observatory
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Cluster: eu-central-prod-01 &bull; mTLS Strict</p>
        </div>
      </div>

      <nav className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleStream}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border cursor-pointer ${
            isStreaming
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
          }`}
        >
          {isStreaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isStreaming ? 'LIVE STREAM' : 'PAUSED'}
        </button>

        <button
          onClick={onReset}
          title="Reset Telemetry & Chaos"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </header>
  );
}
