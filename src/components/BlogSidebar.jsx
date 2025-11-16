// src/components/BlogSidebar.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Reduced-motion safe hook
function useReducedMotionSafe() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function BlogSidebar({ posts = [] }) {
  const reduced = useReducedMotionSafe();
  const mountedRef = useRef(false);

  if (typeof window !== "undefined" && !mountedRef.current) {
    mountedRef.current = true;
  }

  // recent posts
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent = sorted.slice(0, 5);

  // category counts
  const counts = sorted.reduce((acc, p) => {
    const k = p.category || "Uncategorized";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(counts);

  // ⭐ LEFT SLIDE ANIMATION
  const slideLeft = reduced
    ? {}
    : {
        hidden: { opacity: 0, x: -40 },
        show: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        },
      };

  return (
    <motion.aside
      initial="hidden"
      animate="show"
      variants={slideLeft}
      className="space-y-6 w-full md:w-80"
    >
      {/* Search */}
      {/* <div className="bg-white p-4 rounded-xl shadow">
        <label htmlFor="sidebar-search" className="sr-only">
          Search
        </label>
        <div className="flex gap-2">
          <input
            id="sidebar-search"
            type="text"
            placeholder="Search posts..."
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              const val = document.getElementById("sidebar-search")?.value;
              alert("Search (UI only): " + val);
            }}
            className="px-3 py-2 bg-[#0E2D1B] text-white rounded"
          >
            Go
          </button>
        </div>
      </div> */}

      {/* Categories */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Categories</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <Link to="/blog" className="text-[#0E2D1B] font-medium">
              All
            </Link>
            <span className="text-xs text-gray-400">{sorted.length}</span>
          </li>

          {categories.map((c) => (
            <li
              key={c}
              className="flex items-center justify-between hover:bg-gray-50 px-2 py-1 rounded transition"
            >
              <Link
                to={`/blog?category=${c}`}
                className="text-[#0E2D1B] font-medium truncate"
              >
                {c}
              </Link>
              <span className="text-xs text-gray-400">{counts[c]}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Recent Posts</h3>
        <ul className="space-y-3">
          {recent.map((r) => (
            <li key={r.id} className="flex items-center gap-3">
              <Link
                to={`/blog/${r.id}`}
                className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden"
              >
                <img
                  src={r.hero}
                  alt={r.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>

              <div className="min-w-0">
                <Link
                  to={`/blog/${r.id}`}
                  className="text-sm font-medium text-[#0E2D1B] hover:underline line-clamp-2"
                >
                  {r.title}
                </Link>
                <div className="text-xs text-gray-400">
                  {new Date(r.date).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <h4 className="font-semibold text-base text-[#0E2D1B]">
          Join our Newsletter
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          Get the latest gardening tips & updates
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const el = e.target.querySelector("input");
            alert(`Subscribed: ${el.value}`);
            el.value = "";
          }}
          className="mt-3 flex gap-2"
        >
          <input
            type="email"
            required
            placeholder="Your email"
            className="flex-1 px-3 py-2 border rounded text-sm"
          />
          <button className="px-3 py-2 bg-[#0E2D1B] text-white rounded">
            Join
          </button>
        </form>
      </div>
    </motion.aside>
  );
}
