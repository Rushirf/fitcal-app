import { useState, useEffect } from 'react';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(10);
  const [tenure, setTenure] = useState<number>(5); // in years
  const [emi, setEmi] = useState<string>('');
  const [totalInterest, setTotalInterest] = useState<string>('');
  const [totalPayment, setTotalPayment] = useState<string>('');

  const calculateEMI = () => {
    const p = principal;
    const r = rate / 12 / 100; // monthly interest rate
    const n = tenure * 12; // tenure in months

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPaymentValue = emiValue * n;
      const totalInterestValue = totalPaymentValue - p;

      setEmi(emiValue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
      setTotalInterest(totalInterestValue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
      setTotalPayment(totalPaymentValue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
    }
  };

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, tenure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateEMI();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-slate-700">
            Loan Amount (₹)
          </label>
          <input
            id="principal"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-slate-700">
            Annual Interest Rate (%)
          </label>
          <input
            id="rate"
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="tenure" className="block text-sm font-medium text-slate-700">
            Loan Tenure (Years)
          </label>
          <input
            id="tenure"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </form>

      {emi && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Loan Details</h3>
          <div className="space-y-3 text-slate-700">
            <div className="flex justify-between">
              <span>Monthly EMI:</span>
              <span className="font-semibold text-indigo-600">₹ {emi}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Interest Payable:</span>
              <span className="font-semibold">₹ {totalInterest}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Payment (Principal + Interest):</span>
              <span className="font-semibold">₹ {totalPayment}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
