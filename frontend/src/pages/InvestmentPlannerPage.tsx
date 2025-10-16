import { useMemo, useState } from 'react';

export default function InvestmentPlannerPage() {
  const [goal, setGoal] = useState<number>(1000000);
  const [years, setYears] = useState<number>(10);
  const [annualRate, setAnnualRate] = useState<number>(12);

  const result = useMemo(() => {
    const r = annualRate / 100 / 12;
    const n = Math.max(0, Math.floor(years * 12));
    if (n === 0) return { monthly: goal, invested: goal, gain: 0 };
    if (r === 0) {
      const monthly = goal / n;
      return { monthly, invested: monthly * n, gain: 0 };
    }
    // FV = P * ((1+r)^n - 1) * (1+r) / r  =>  P = FV * r / (((1+r)^n - 1) * (1+r))
    const monthly = goal * r / ((Math.pow(1 + r, n) - 1) * (1 + r));
    const invested = monthly * n;
    const gain = goal - invested;
    return { monthly, invested, gain };
  }, [goal, years, annualRate]);

  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200/70 p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-6 text-center">
            Investment Planner
          </h2>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-700">Goal Amount (₹)</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={goal}
                min={0}
                onChange={(e) => setGoal(Number(e.target.value))}
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Years to Goal</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={years}
                min={0}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Expected Return (% p.a.)</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={annualRate}
                min={0}
                step="0.1"
                onChange={(e) => setAnnualRate(Number(e.target.value))}
              />
            </label>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat label="Required Monthly SIP" value={result.monthly} />
              <Stat label="Total Invested" value={result.invested} />
              <Stat label="Expected Gain" value={result.gain} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-lg font-semibold text-slate-900">
        ₹{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
}
