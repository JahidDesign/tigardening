// src/components/ProductCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col">
      <div className="w-full h-44 bg-gray-100 rounded-t-2xl overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-[#0E2D1B] line-clamp-2">
            {product.name}
          </h3>
          {product.rating && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              ★ {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1">{product.category}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[#E58E26] font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="line-through text-gray-400 text-xs">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-[#0E2D1B] text-white py-2 rounded-full text-sm font-medium hover:bg-[#143b25] transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
