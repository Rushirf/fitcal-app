import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login';
import Signup from './pages/Signup';
import "tailwindcss";
import EMICalculatorPage from './pages/EMICalculatorPage';
import SIPCalculatorPage from './pages/SIPCalculatorPage';
import XIRRCalculatorPage from './pages/XIRRCalculatorPage';
import InvestmentPlannerPage from './pages/InvestmentPlannerPage';
import type { JSX } from 'react';

// SessionStorage-based route guards
const isLoggedIn = () => !!sessionStorage.getItem('username');

function RequireAuth({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/emi-calculator" element={<RequireAuth><EMICalculatorPage /></RequireAuth>} />
        <Route path="/sip-calculator" element={<RequireAuth><SIPCalculatorPage /></RequireAuth>} />
        <Route path="/xirr-calculator" element={<RequireAuth><XIRRCalculatorPage /></RequireAuth>} />
        <Route path="/investment-planner" element={<RequireAuth><InvestmentPlannerPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
