// src/App.jsx
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";   

export default function App() {
  return (
    <HelmetProvider>
      <CartProvider> 
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navbar />

          <main className="">
            <AppRoutes />
          </main>

          <Footer />
        </div>
      </CartProvider>
    </HelmetProvider>
  );
}
