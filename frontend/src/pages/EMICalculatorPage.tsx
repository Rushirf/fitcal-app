import EMICalculator from '../components/EMICalculator';

export default function EMICalculatorPage() {
  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200/70 p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-6 text-center">
            EMI Calculator
          </h2>
          <EMICalculator />
        </div>
      </div>
    </div>
  );
}
