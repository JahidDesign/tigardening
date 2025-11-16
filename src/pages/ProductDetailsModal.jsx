// src/components/ProductDetailsModal.jsx
import React from "react";

function formatPriceBDT(value) {
  return `৳ ${value.toLocaleString("en-BD")}`;
}

export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg overflow-hidden">
        
        {/* Image */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>

          <p className="text-sm text-gray-500 mt-1">{product.category}</p>

          {/* Prices */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-lg font-bold text-green-700">
              {formatPriceBDT(product.price)}
            </span>
            <span className="text-sm line-through text-gray-400">
              {formatPriceBDT(product.oldPrice)}
            </span>
          </div>

          {/* Rating */}
          <p className="mt-2 text-yellow-600 font-medium text-sm">
            ⭐ {product.rating.toFixed(1)} / 5
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-5 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
