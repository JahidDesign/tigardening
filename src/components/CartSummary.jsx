// src/components/CartSummary.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function CartSummary() {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="fixed bottom-4 right-4 bg-[#0E2D1B] text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3">
      <div className="flex flex-col text-sm">
        <span className="font-semibold">
          Cart: {totalItems} item{totalItems !== 1 ? "s" : ""}
        </span>
        <span className="text-xs text-gray-200">
          Total: ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
