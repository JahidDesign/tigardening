import React, { useState, useEffect } from "react";
import FruitTreeCard from "./FruitTreeCard";
import FruitTreeDetailsModal from "./FruitTreeDetailsModal";

export default function FruitTreesPage() {
  const [fruitTrees, setFruitTrees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTree, setSelectedTree] = useState(null);

  const itemsPerPage = 6;

  // Load JSON file
  useEffect(() => {
    fetch("/data/fruitstrees.json")
      .then((res) => res.json())
      .then((json) => {
        // stringify not required, but if you want:
        const data = JSON.parse(JSON.stringify(json));
        setFruitTrees(data);
      })
      .catch((err) => console.error("JSON Load Error:", err));
  }, []);

  const totalPages = Math.ceil(fruitTrees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTrees = fruitTrees.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-3 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Fruit Trees</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentTrees.map((tree) => (
          <FruitTreeCard key={tree.id} tree={tree} onSelect={setSelectedTree} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === index + 1
                ? "bg-green-600 text-white border-green-600"
                : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <FruitTreeDetailsModal tree={selectedTree} onClose={() => setSelectedTree(null)} />
    </div>
  );
}
