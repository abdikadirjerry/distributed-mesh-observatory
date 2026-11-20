import { useState } from 'react';

export function SlaBurnRateCard() {
  const [sloTarget, setSloTarget] = useState<number>(99.9);
  const [observedAvailability, setObservedAvailability] = useState<number>(99.45);

  const allowedErrorPct = Math.max(0.0001, 100 - sloTarget);
  const actualErrorPct = Math.max(0, 100 - observedAvailability);
  const burnRate = Number((actualErrorPct / allowedErrorPct).toFixed(2));
  const hoursToExhaust30DayBudget = burnRate > 0 ? Math.round(720 / burnRate) : 720;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 flex flex-col justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-100">30-Day Error Budget Burn-Rate Estimator</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Calculate how fast current error rates exhaust your monthly SLO budget</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <label className="flex flex-col gap-1">
          <span className="text-zinc-400">Monthly SLO (%)</span>
          <input
            type="number"
            step="0.05"
            min="95"
            max="99.99"
            value={sloTarget}
            onChange={(e) => setSloTarget(parseFloat(e.target.value) || 99.9)}
            className="rounded bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-400">Observed Avail. (%)</span>
          <input
            type="number"
            step="0.05"
            min="80"
            max="100"
            value={observedAvailability}
            onChange={(e) => setObservedAvailability(parseFloat(e.target.value) || 99.9)}
            className="rounded bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 text-zinc-100"
          />
        </label>
      </div>

      <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 flex items-center justify-between font-mono text-xs">
        <div>
          <div className="text-zinc-500">BURN RATE</div>
          <div className={`text-base font-bold ${burnRate > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {burnRate}x
          </div>
        </div>
        <div className="text-right">
          <div className="text-zinc-500">BUDGET EXHAUSTION</div>
          <div className="text-sm font-bold text-zinc-200">{hoursToExhaust30DayBudget} hrs</div>
        </div>
      </div>
    </div>
  );
}
