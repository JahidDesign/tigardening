import React from "react";

function formatPriceBDT(value) {
  return `৳ ${value.toLocaleString("en-BD")}`;
}

export default function FruitTreeCard({ tree, onSelect }) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white flex flex-col">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={tree.image}
          alt={tree.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {tree.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {tree.category}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm sm:text-base font-bold text-green-700">
            {formatPriceBDT(tree.price)}
          </span>
          <span className="text-xs sm:text-sm line-through text-gray-400">
            {formatPriceBDT(tree.oldPrice)}
          </span>
        </div>

        <div className="mt-2 text-xs sm:text-sm text-yellow-500">
          ⭐ {tree.rating.toFixed(1)}
        </div>

        <button
          onClick={() => onSelect(tree)}
          className="mt-3 w-full py-2 bg-[#0E2D1B] text-white rounded-lg text-sm hover:bg-green-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
