import { PlusCircle } from 'lucide-react';
import type { DistributedTrace } from '../types/mesh';

interface Props {
  traces: DistributedTrace[];
  selectedTraceId: string;
  onSelectTrace: (id: string) => void;
  onCaptureLiveTrace: () => void;
}

export function TraceWaterfallView({
  traces,
  selectedTraceId,
  onSelectTrace,
  onCaptureLiveTrace,
}: Props) {
  const activeTrace = traces.find((t) => t.traceId === selectedTraceId) ?? traces[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">Captured Traces ({traces.length})</h2>
          <button
            onClick={onCaptureLiveTrace}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Sample Live Trace
          </button>
        </div>

        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {traces.map((trace) => {
            const isSelected = trace.traceId === activeTrace.traceId;
            return (
              <button
                key={trace.traceId}
                onClick={() => onSelectTrace(trace.traceId)}
                className={`w-full text-left p-3 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-500'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-violet-400">{trace.traceId}</span>
                  <span className={trace.hasError ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {trace.totalDurationMs} ms
                  </span>
                </div>
                <div className="mt-1 text-xs font-mono text-zinc-200 truncate">{trace.rootEndpoint}</div>
                <div className="mt-1 text-[11px] text-zinc-500">{trace.timestamp} &bull; {trace.spans.length} spans</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-2">
          <div>
            <div className="text-xs font-mono text-violet-400">{activeTrace.traceId}</div>
            <h3 className="text-base font-bold font-mono text-zinc-100">{activeTrace.rootEndpoint}</h3>
          </div>
          <div className="text-right font-mono text-xs">
            <div className="text-zinc-400">End-to-End Duration</div>
            <div className={`text-base font-bold ${activeTrace.hasError ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeTrace.totalDurationMs} ms
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {activeTrace.spans.map((span) => {
            const leftPct = Math.min(92, (span.startOffsetMs / Math.max(1, activeTrace.totalDurationMs)) * 100);
            const widthPct = Math.max(4, (span.durationMs / Math.max(1, activeTrace.totalDurationMs)) * 100);
            const barColor =
              span.status === 'ERROR' ? 'bg-rose-500' : span.status === 'WARN' ? 'bg-amber-500' : 'bg-violet-500';

            return (
              <div key={span.spanId} className="rounded-lg bg-zinc-950 border border-zinc-800/90 p-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-2 mb-2">
                  <div>
                    <span className="text-zinc-200 font-semibold">{span.serviceName}</span>
                    <span className="text-zinc-500"> :: {span.operation}</span>
                  </div>
                  <span className="text-zinc-300">+{span.startOffsetMs}ms ({span.durationMs}ms)</span>
                </div>

                <div className="h-3 w-full rounded bg-zinc-900 relative overflow-hidden">
                  <div
                    className={`h-full rounded ${barColor}`}
                    style={{ marginLeft: `${leftPct}%`, width: `${Math.min(100 - leftPct, widthPct)}%` }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(span.tags).map(([k, v]) => (
                    <span key={k} className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {k}={v}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
