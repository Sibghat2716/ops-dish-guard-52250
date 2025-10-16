import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./contexts/StoreContext";
import { DeploymentProvider } from "./contexts/DeploymentContext";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import MenuManagementPage from "./pages/MenuManagementPage";
import TimeBasedMenus from "./pages/TimeBasedMenus";
import AdminDashboard from "./pages/AdminDashboard";
import ProductEnrichmentPage from "./pages/ProductEnrichmentPage";
import CouponEnrichmentPage from "./pages/CouponEnrichmentPage";
import MasterMenuManagement from "./pages/MasterMenuManagement";
import StoreManagement from "./pages/StoreManagement";
import BulkUpload from "./pages/BulkUpload";
import DeploymentPage from "./pages/DeploymentPage";
import PrepTimeManagement from "./pages/PrepTimeManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Store context provider wraps all components
const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <DeploymentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="menu-management" element={<MenuManagementPage />} />
              <Route path="store-management" element={<StoreManagement />} />
              <Route path="time-based-menus" element={<TimeBasedMenus />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/master-list/stores" element={<AdminDashboard />} />
              <Route path="admin/master-list/products" element={<MasterMenuManagement />} />
              <Route path="admin/enrichment/product" element={<ProductEnrichmentPage />} />
              <Route path="admin/enrichment/coupon" element={<CouponEnrichmentPage />} />
              <Route path="admin/bulk-upload" element={<BulkUpload />} />
              <Route path="admin/bulk-menu-upload" element={<BulkUpload />} />
              <Route path="admin/bulk-location-upload" element={<BulkUpload />} />
              <Route path="admin/prep-time" element={<PrepTimeManagement />} />
              <Route path="admin/deploy" element={<DeploymentPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </DeploymentProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
