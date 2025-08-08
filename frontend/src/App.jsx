import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminProductNew from "./pages/AdminProductNew";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminRelatorios from "./pages/AdminRelatorios";
import AdminCustomers from "./pages/AdminCustomers";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/produtos" element={
            <PrivateRoute>
              <AdminProducts />
            </PrivateRoute>
          } />
          <Route path="/admin/produtos/novo" element={
            <PrivateRoute>
              <AdminProductNew />
            </PrivateRoute>
          } />
          <Route path="/admin/produtos/editar/:id" element={
            <PrivateRoute>
              <AdminProductEdit />
            </PrivateRoute>
          } />
          <Route path="/admin/pedidos" element={
            <PrivateRoute>
              <AdminOrders />
            </PrivateRoute>
          } />
          <Route path="/admin/pedidos/:id" element={
            <PrivateRoute>
              <AdminOrderDetails />
            </PrivateRoute>
          } />
          <Route path="/admin/relatorios" element={
            <PrivateRoute>
              <AdminRelatorios />
            </PrivateRoute>
          } />
          <Route path="/admin/clientes" element={
            <PrivateRoute>
              <AdminCustomers />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App