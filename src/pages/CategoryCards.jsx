import React, { useEffect, useState } from "react";
import { ShoppingBag, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryCards() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  async function fetchCategories() {
    try {
      const response = await fetch("/data/categories.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevious = () => currentPage > 1 && goToPage(currentPage - 1);
  const goToNext = () => currentPage < totalPages && goToPage(currentPage + 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <section className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0E2D1B] mb-2">
          Shop by Category
        </h2>

        {!loading && categories.length > 0 && (
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, categories.length)} of{" "}
            {categories.length} categories
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#E58E26] animate-spin mb-3" />
          <p className="text-gray-600 text-sm">Loading categories...</p>
        </div>
      )}

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {!loading &&
          currentCategories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#E58E26] transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-28 sm:h-36 md:h-40 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 text-[#E58E26]" />
                </div>
              </div>

              <div className="p-3 sm:p-4 text-center">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#0E2D1B] mb-1 sm:mb-2 line-clamp-1 group-hover:text-[#E58E26] transition-colors duration-300">
                  {cat.name}
                </h3>
                <button className="inline-flex items-center justify-center gap-1 mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-[#E58E26] hover:text-[#c9781f] group-hover:gap-2 transition-all duration-300">
                  <span>View Products</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </button>
              </div>

              <div className="h-1 bg-gradient-to-r from-transparent via-[#E58E26] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
      </div>

      {/* Empty */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-base mb-2">No categories available</p>
          <p className="text-gray-500 text-sm">Please check back later</p>
        </div>
      )}

      {/* Pagination — Centered */}
      {!loading && categories.length > itemsPerPage && (
        <div className="mt-10 sm:mt-12 flex flex-col items-center gap-4">
          {/* Mobile */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <span className="text-sm text-gray-700 font-medium px-3">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden sm:flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#E58E26] transition text-sm font-medium text-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-[40px] h-10 rounded-lg border transition font-medium text-sm ${
                        currentPage === page
                          ? "bg-[#E58E26] text-white border-[#E58E26] shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#E58E26]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-[#E58E26] transition text-sm font-medium text-gray-700"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
