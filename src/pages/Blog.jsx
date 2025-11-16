// src/pages/Blog.jsx
import React, { useEffect, useState } from "react";
import PageHead from "../components/PageHead";
import Loader from "../components/Loader";
import BlogList from "../components/BlogList";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load posts.json
  useEffect(() => {
    let mounted = true;

    setLoading(true);

    fetch("/data/posts.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load posts.json");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setPosts(data);
        else setPosts([]);
      })
      .catch((err) => {
        console.error("Blog load error:", err);
        if (mounted) setError(err.message || "Failed to fetch posts");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className=" min-h-screen pt-24 pb-20">
      {/* SEO Head */}
      <PageHead
        title="Blog — TriGardening"
        description="Read gardening tips, plant care guides, fertilizer advice, and more from our experts."
      />

      <section className="max-w-8xl mx-auto px-6">

        {/* Page Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0E2D1B]">
            Gardening Blog
          </h1>
          <p className="text-gray-600 mt-2">
            Explore tips, guides, tutorials & expert advice
          </p>
        </header>

        {/* Loading */}
        {loading && <Loader />}

        {/* Error */}
        {error && (
          <div className="bg-white text-center text-red-600 p-6 rounded-xl shadow">
            <p className="font-semibold">Error loading posts</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* No posts */}
        {!loading && !error && posts.length === 0 && (
          <div className="bg-white text-center text-gray-600 p-6 rounded-xl shadow">
            No blog posts found.
          </div>
        )}

        {/* Blog List */}
        {!loading && !error && posts.length > 0 && (
          <BlogList posts={posts} />
        )}
      </section>
    </main>
  );
}
