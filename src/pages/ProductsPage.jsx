// src/pages/ProductsPage.jsx
import React from "react";
import ProductsGrid from "./ProductsGrid";
import CartSummary from "../components/CartSummary";

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-16">
      <ProductsGrid />
      <CartSummary />
    </div>
  );
}
