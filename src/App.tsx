import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import TV from "./pages/TV";
import Radios from "./pages/Radios";
import VOD from "./pages/VOD";
import Menu from "./pages/Menu";
import DVBT2 from "./pages/DVB-T2";
import Subscription from "./pages/Subscription";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Notifications from "./pages/Notifications";
import ParentalControl from "./pages/ParentalControl";
import ConnectedDevices from "./pages/ConnectedDevices";
import ConnexionSmartTV from "./pages/ConnexionSmartTV";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="tv" element={<TV />} />
            <Route path="radios" element={<Radios />} />
            <Route path="vod" element={<VOD />} />
            <Route path="menu" element={<Menu />} />
            <Route path="admin" element={<Admin />} />
            <Route path="dvb-t2" element={<DVBT2 />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="parental-control" element={<ParentalControl />} />
            <Route path="connected-devices" element={<ConnectedDevices />} />
            <Route path="connexion-smart-tv" element={<ConnexionSmartTV />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
