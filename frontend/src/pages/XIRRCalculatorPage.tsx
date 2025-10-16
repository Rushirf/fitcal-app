import { useMemo, useState } from 'react';

type Flow = { date: Date; amount: number };

function xirr(flows: Flow[], guess = 0.1): number | null {
  if (!flows.length) return null;
  const t0 = flows[0].date.getTime();
  const years = (t: number) => (t - t0) / (365 * 24 * 3600 * 1000);

  const npv = (r: number) =>
    flows.reduce((sum, f) => sum + f.amount / Math.pow(1 + r, years(f.date.getTime())), 0);

  const dnpv = (r: number) =>
    flows.reduce(
      (sum, f) => sum + (-years(f.date.getTime()) * f.amount) / Math.pow(1 + r, years(f.date.getTime()) + 1),
      0
    );

  let r = guess;
  for (let i = 0; i < 100; i++) {
    const f = npv(r);
    const df = dnpv(r);
    if (Math.abs(df) < 1e-12) break;
    const r1 = r - f / df;
    if (!isFinite(r1) || r1 <= -0.999999) break;
    if (Math.abs(r1 - r) < 1e-10) return r1;
    r = r1;
  }
  return Math.abs(npv(r)) < 1e-6 ? r : null;
}

export default function XIRRCalculatorPage() {
  const [raw, setRaw] = useState<string>(
    [
      '2023-01-01,-100000',
      '2023-06-01,-20000',
      '2024-01-01,135000',
    ].join('\n')
  );

  const { flows, error } = useMemo(() => {
    try {
      const lines = raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      const flows: Flow[] = lines.map((line) => {
        const [d, a] = line.split(',');
        const date = new Date(d);
        const amount = Number(a);
        if (isNaN(amount) || isNaN(date.getTime())) throw new Error('Invalid line: ' + line);
        return { date, amount };
      });
      flows.sort((a, b) => a.date.getTime() - b.date.getTime());
      return { flows, error: null as string | null };
    } catch (e: any) {
      return { flows: [] as Flow[], error: e?.message ?? 'Parse error' };
    }
  }, [raw]);

  const rate = useMemo(() => (flows.length ? xirr(flows, 0.1) : null), [flows]);

  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200/70 p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-6 text-center">
            XIRR Calculator
          </h2>

          <p className="text-slate-600 text-sm mb-3">
            Enter one cashflow per line: YYYY-MM-DD,amount. Use negative for investments and positive for redemptions.
          </p>

          <textarea
            className="w-full h-40 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />

          <div className="mt-6">
            {error ? (
              <div className="text-red-600 text-sm">{error}</div>
            ) : rate === null ? (
              <div className="text-slate-600 text-sm">Unable to compute XIRR for the provided cashflows.</div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-4 text-center">
                <div className="text-xs uppercase tracking-wide text-slate-500">XIRR (Annualized)</div>
                <div className="text-2xl font-semibold text-slate-900">
                  {(rate * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}% p.a.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
