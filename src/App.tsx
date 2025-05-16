import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductsPage from "./pages/dashboard/Products";
import ProductDetailPage from "./pages/dashboard/ProductDetail";
import ProductFormPage from "./pages/dashboard/ProductForm";
import OrdersPage from "./pages/dashboard/Orders";
import OrderDetailPage from "./pages/dashboard/OrderDetail";
import UsersPage from "./pages/dashboard/Users";
import UserDetailPage from "./pages/dashboard/UserDetail";
import ShipmentsPage from "./pages/dashboard/Shipments";
import ShipmentDetail from "./pages/dashboard/ShipmentDetail";
import ShipmentForm from "./pages/dashboard/ShipmentForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="shipments" element={<ShipmentsPage />} />
            <Route path="shipments/new" element={<ShipmentForm />} />
            <Route path="shipments/:id" element={<ShipmentDetail />} />
            <Route path="shipments/:id/edit" element={<ShipmentForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
