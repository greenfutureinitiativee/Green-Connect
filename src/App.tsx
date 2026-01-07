import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// Pages commented out
import Home from "./pages/Home";
import ExploreLGAs from "./pages/ExploreLGAs";
import LGADetail from "./pages/LGADetail";
import News from "./pages/News";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Donate from "./pages/Donate";
import ReportIssue from "./pages/ReportIssue";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LGAGovernanceForm from "./pages/admin/LGAGovernanceForm";
import LGADashboard from "./pages/LGADashboard";
import Ministries from "./pages/Ministries";
import { GreenOracleChat } from "./components/GreenOracleChat";

const queryClient = new QueryClient();

const App = () => {
  console.log("App with providers rendering");
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* Placeholder routes for now */}
                  <Route path="/explore" element={<ExploreLGAs />} />
                  <Route path="/lga/:stateName/:lgaName" element={<LGADetail />} />
                  <Route path="/report" element={<ReportIssue />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/ministries" element={<Ministries />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/lga-dashboard" element={<LGADashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/governance" element={<LGAGovernanceForm />} />
                </Routes>
              </main>
              <GreenOracleChat />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
