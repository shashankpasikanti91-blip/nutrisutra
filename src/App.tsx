import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Pricing from "./pages/Pricing.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Demo from "./pages/Demo.tsx";
import DailyIntakeCalculator from "./pages/DailyIntakeCalculator.tsx";
import WaterTracker from "./pages/WaterTracker.tsx";
import DemoTracker from "./pages/DemoTracker.tsx";
import Analyze from "./pages/Analyze.tsx";
import Dashboard from "./pages/app/Dashboard.tsx";
import FoodResult from "./pages/app/FoodResult.tsx";
import History from "./pages/app/History.tsx";
import Insights from "./pages/app/Insights.tsx";
import Settings from "./pages/app/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import { InstallPrompt } from "@/components/common/InstallPrompt";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { TrialBanner } from "@/components/common/TrialBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <InstallPrompt />
        <TrialBanner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/demo/calculator" element={<DailyIntakeCalculator />} />
          <Route path="/demo/water" element={<WaterTracker />} />
          <Route path="/demo/tracker" element={<DemoTracker />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/app/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/app/food" element={<ProtectedRoute><FoodResult /></ProtectedRoute>} />
          <Route path="/app/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/app/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
