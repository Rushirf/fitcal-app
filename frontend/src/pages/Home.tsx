
import Card from "../components/Crad";

export default function Home() {

 return (
  <div className="min-h-screen w-[100vw] bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Welcome back! Here are some tools to help you manage your finances.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card 
          title="EMI CalculatorN" 
          description="Calculate your Equated Monthly Installment for loans."
          navigateTo="/emi-calculator" 
        />
        <Card 
          title="SIP Calculator" 
          description="Estimate future value of your monthly investments."
          navigateTo="/sip-calculator" 
        />
        <Card 
          title="XIRR Calculator" 
          description="Compute annualized returns for irregular cashflows."
          navigateTo="/xirr-calculator" 
        />
        <Card 
          title="Investment Planner" 
          description="Plan how much to invest monthly to hit a goal."
          navigateTo="/investment-planner" 
        />
        {/* You can add more cards here for other tools */}
        {/* Example:
        <Card 
          title="Another Tool" 
          description="Description of the tool."
          buttonText="Open Tool"
          navigateTo="/another-tool" 
        />
        */}
      </div>
    </div>
  </div>
 )
}