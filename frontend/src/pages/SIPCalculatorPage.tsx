import { useMemo, useState } from 'react';

export default function SIPCalculatorPage() {
  const [monthly, setMonthly] = useState<number>(10000);
  const [years, setYears] = useState<number>(10);
  const [annualRate, setAnnualRate] = useState<number>(12);

  const results = useMemo(() => {
    const r = annualRate / 100 / 12;
    const n = Math.max(0, Math.floor(years * 12));
    if (r === 0) {
      const invested = monthly * n;
      return { invested, maturity: invested, gain: 0 };
    }
    const maturity = monthly * ((Math.pow(1 + r, n) - 1) * (1 + r)) / r;
    const invested = monthly * n;
    const gain = maturity - invested;
    return { invested, maturity, gain };
  }, [monthly, years, annualRate]);

  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200/70 p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-6 text-center">
            SIP Calculator
          </h2>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-700">Monthly Investment (₹)</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={monthly}
                min={0}
                onChange={(e) => setMonthly(Number(e.target.value))}
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Years</span>
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
              <Stat label="Total Invested" value={results.invested} />
              <Stat label="Maturity Value" value={results.maturity} />
              <Stat label="Total Gain" value={results.gain} />
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
