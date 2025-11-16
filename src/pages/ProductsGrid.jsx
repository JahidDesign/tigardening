// src/components/ProductsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

const PER_PAGE = 8;

export default function ProductsGrid() {
  const [plants, setPlants] = useState([]);
  const [tools, setTools] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all, plants, tools, fertilizers
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, tRes, fRes] = await Promise.all([
          fetch("/data/plants.json"),
          fetch("/data/tools.json"),
          fetch("/data/fertilizers.json"),
        ]);
        const [pData, tData, fData] = await Promise.all([
          pRes.json(),
          tRes.json(),
          fRes.json(),
        ]);

        const labeledPlants = pData.map((item) => ({
          ...item,
          type: "plants",
        }));
        const labeledTools = tData.map((item) => ({
          ...item,
          type: "tools",
        }));
        const labeledFerts = fData.map((item) => ({
          ...item,
          type: "fertilizers",
        }));

        setPlants(labeledPlants);
        setTools(labeledTools);
        setFertilizers(labeledFerts);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const allProducts = useMemo(
    () => [...plants, ...tools, ...fertilizers],
    [plants, tools, fertilizers]
  );

  // build list of categories from all products
  const allCategories = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let items = allProducts;

    // type filter
    if (typeFilter !== "all") {
      items = items.filter((p) => p.type === typeFilter);
    }

    // category filter
    if (categoryFilter !== "all") {
      items = items.filter((p) => p.category === categoryFilter);
    }

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
    }

    // sort
    if (sortBy === "price-asc") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
      items = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name-asc") {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [allProducts, typeFilter, categoryFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PER_PAGE));

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // reset to page 1 when filters or search change
    setPage(1);
  }, [search, typeFilter, categoryFilter, sortBy]);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between bg-white rounded-2xl shadow p-4">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E58E26]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Product Type
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="plants">Plants</option>
            <option value="tools">Tools</option>
            <option value="fertilizers">Fertilizers</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Category
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Sort By
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating-desc">Rating: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
          products
        </span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-white rounded-2xl shadow">
          No products found. Try changing filters or search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={`${product.type}-${product.id}`} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > PER_PAGE && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 text-sm border rounded-full disabled:opacity-40"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={`px-3 py-1 text-sm border rounded-full ${
                  pageNum === currentPage
                    ? "bg-[#0E2D1B] text-white border-[#0E2D1B]"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="px-3 py-1 text-sm border rounded-full disabled:opacity-40"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
