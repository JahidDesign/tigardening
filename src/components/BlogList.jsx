// src/components/BlogList.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BlogSidebar from "./BlogSidebar";
// import ShareBar from "./ShareBar";

export default function BlogList({ posts = [] }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = params.get("category") || "";
  const qParam = params.get("q") || "";
  const pageParam = parseInt(params.get("page") || "1", 10);

  const [searchValue, setSearchValue] = useState(qParam);

  // keep input in sync with URL q param
  useEffect(() => {
    setSearchValue(qParam);
  }, [qParam]);

  // helper to update a single query param and keep others
  function setQuery(key, value) {
    const p = new URLSearchParams(params);

    if (value && value.length > 0) {
      p.set(key, value);
    } else {
      p.delete(key);
    }

    // when changing filters/search, reset page to 1
    if (key !== "page") {
      p.set("page", "1");
    }

    const query = p.toString();
    navigate(`/blog${query ? `?${query}` : ""}`);
  }

  // filter posts by category + search
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (categoryParam && p.category !== categoryParam) return false;

      if (qParam) {
        const q = qParam.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [posts, categoryParam, qParam]);

  // pagination logic
  const PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage =
    !Number.isNaN(pageParam) && pageParam > 0
      ? Math.min(pageParam, totalPages)
      : 1;

  const startIndex = (currentPage - 1) * PER_PAGE;
  const visiblePosts = filtered.slice(startIndex, startIndex + PER_PAGE);

  // Animation for card slide-in
  const leftRightAnim = {
    hidden: (i) => ({
      opacity: 0,
      x: i % 2 === 0 ? -40 : 40,
    }),
    show: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const categories = Array.from(new Set(posts.map((p) => p.category))).filter(
    Boolean
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <BlogSidebar posts={posts} />
      </div>

      {/* Blog list */}
      <div className="md:col-span-3">
        {/* Filters */}
        <div className="mb-6 flex flex-col lg:flex-row lg:justify-between gap-4">
          {/* Search */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <input
              className="w-full lg:w-80 px-3 py-2 border rounded"
              placeholder="Search posts..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setQuery("q", e.target.value.trim());
              }}
            />
            <button
              className="px-4 py-2 bg-[#0E2D1B] text-white rounded"
              onClick={() => setQuery("q", searchValue.trim())}
            >
              Search
            </button>
            <button
              className="px-4 py-2 bg-gray-100 rounded"
              onClick={() => {
                setSearchValue("");
                setQuery("q", "");
              }}
            >
              Clear
            </button>
          </div>

          {/* Category */}
          <div>
            <select
              className="px-3 py-2 border rounded"
              value={categoryParam}
              onChange={(e) => setQuery("category", e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map((post, i) => (
            <motion.article
              key={post.id}
              variants={leftRightAnim}
              initial="hidden"
              animate="show"
              custom={i}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >
              {/* Image */}
              <div className="h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={post.hero}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-400">
                    {post.category} • {post.minutesToRead || 3} min read
                  </span>
                  {/* <ShareBar post={post} /> */}
                </div>

                <h2 className="text-lg font-semibold text-[#0E2D1B] mt-2">
                  <Link to={`/blog/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </span>

                  <Link
                    to={`/blog/${post.id}`}
                    className="text-[#E58E26] hover:opacity-90 text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-white rounded-xl p-6 text-center text-gray-600">
              No posts found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              className="px-3 py-1 text-sm border rounded disabled:opacity-40"
              onClick={() => setQuery("page", String(currentPage - 1))}
              disabled={currentPage <= 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm border rounded ${
                    page === currentPage
                      ? "bg-[#0E2D1B] text-white border-[#0E2D1B]"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setQuery("page", String(page))}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="px-3 py-1 text-sm border rounded disabled:opacity-40"
              onClick={() => setQuery("page", String(currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
