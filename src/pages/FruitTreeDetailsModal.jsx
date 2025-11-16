import React from "react";

function formatPriceBDT(value) {
  return `৳ ${value.toLocaleString("en-BD")}`;
}

export default function FruitTreeDetailsModal({ tree, onClose }) {
  if (!tree) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg overflow-hidden">
        <div className="w-full h-64 overflow-hidden">
          <img
            src={tree.image}
            alt={tree.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900">{tree.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{tree.category}</p>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-lg font-bold text-green-700">
              {formatPriceBDT(tree.price)}
            </span>
            <span className="text-sm line-through text-gray-400">
              {formatPriceBDT(tree.oldPrice)}
            </span>
          </div>

          <p className="mt-2 text-yellow-600 font-medium text-sm">
            ⭐ {tree.rating.toFixed(1)} / 5
          </p>

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
