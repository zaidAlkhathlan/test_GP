import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import BuyerHome from "./pages/BuyerHome";
import BuyerSignIn from "./pages/BuyerSignIn";
import NotFound from "./pages/NotFound";
import TenderDetails from "./pages/TenderDetails";
import TenderOffers from "./pages/TenderOffers";
import AwardedSupplier from "./pages/AwardedSupplier";
import ActiveTenders from "./pages/ActiveTenders";
import ExpiredTenders from "./pages/ExpiredTenders";
import Quires from "./pages/Quires";
import CreateTender from "./pages/CreateTender";
import SupplierSignIn from "./pages/SupplierSignIn";
import SupplierHome from "./pages/SupplierHome";
import AvailableTenders from "./pages/AvailableTenders";
import CompanyProfile from "./pages/CompanyProfile";
import SubmitOffer from "./pages/SubmitOffer";
import SupplierChat from "./pages/SupplierChat";
import AppliedTenders from "./pages/AppliedTenders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buyer" element={<BuyerHome />} />
          <Route path="/buyer/home" element={<BuyerHome />} />
          <Route path="/buyer/signin" element={<BuyerSignIn />} />
          <Route path="/tenders/active" element={<ActiveTenders />} />
          <Route path="/tenders/expired" element={<ExpiredTenders />} />
          <Route path="/tenders/new" element={<CreateTender />} />
          <Route path="/tender/:id/quires" element={<Quires />} />
          <Route path="/tender/:id" element={<TenderDetails />} />
          <Route path="/tender/:id/offers" element={<TenderOffers />} />
          <Route path="/tender/:id/chat" element={<SupplierChat />} />
          <Route path="/tender/:id/submit-offer" element={<SubmitOffer />} />
          <Route path="/tender/:id/award/:offerId" element={<AwardedSupplier />} />
          <Route path="/supplier/signin" element={<SupplierSignIn />} />
          <Route path="/supplier/home" element={<SupplierHome />} />
          <Route path="/available-tenders" element={<AvailableTenders />} />
          <Route path="/supplier/offers" element={<AppliedTenders />} />
          <Route path="/supplier/applied-tenders" element={<AppliedTenders />} />
          <Route path="/supplier/expired" element={<div className="p-8 text-center" dir="rtl">صفحة المناقصات المنتهية قيد التطوير</div>} />
          <Route path="/about" element={<div className="p-8 text-center" dir="rtl">صفحة من نحن قيد التطوير</div>} />
          <Route path="/contact" element={<div className="p-8 text-center" dir="rtl">صفحة اتصل بنا قيد التطوير</div>} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
