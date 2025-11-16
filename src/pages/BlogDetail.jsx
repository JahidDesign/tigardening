// src/pages/BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageHead from "../components/PageHead";
import Loader from "../components/Loader";
import ShareBar from "../components/ShareBar";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/data/posts.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load posts");
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setAll(Array.isArray(data) ? data : []);
        const found = (data || []).find((p) => String(p.id) === String(id));
        setPost(found || null);
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setError(e.message || "Failed to load");
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [id]);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  if (!post) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-[#F6F6EE]">
        <section className="max-w-4xl mx-auto px-6 text-center py-24 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <p className="text-gray-600 mb-6">This post could not be located.</p>
          <div className="flex justify-center gap-4">
            <Link to="/blog" className="px-4 py-2 bg-[#E58E26] text-white rounded">Back to blog</Link>
            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Go back</button>
          </div>
        </section>
      </main>
    );
  }

  // related posts: same category, exclude current
  const related = (all || []).filter((p) => p.category === post.category && String(p.id) !== String(post.id)).slice(0, 4);

  return (
    <main className="bg-[#F6F6EE] min-h-screen pt-24 pb-20">
      <PageHead title={`${post.title} — TriGardening`} description={post.excerpt} />
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <img src={post.hero} alt={post.title} className="w-full h-80 object-cover" loading="lazy" />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">{post.category} • {post.minutesToRead ?? 3} min read</div>
              <ShareBar post={post} />
            </div>

            <h1 className="text-3xl font-extrabold text-[#0E2D1B] mt-4">{post.title}</h1>
            <div className="text-sm text-gray-500 mt-1">{new Date(post.date).toLocaleDateString()}</div>

            <article className="prose prose-lg mt-6 text-gray-700">
              {/* If full content exists in JSON use it, otherwise show excerpt */}
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p>{post.excerpt}</p>
              )}
            </article>

            <div className="mt-6 flex gap-3">
              <Link to="/blog" className="px-4 py-2 bg-[#E58E26] text-white rounded">Back to blog</Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="px-4 py-2 border rounded">Back to top</button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Related posts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link to={`/blog/${r.id}`} key={r.id} className="block bg-white rounded-lg overflow-hidden shadow-sm">
                  <img src={r.hero} alt={r.title} className="w-full h-32 object-cover" loading="lazy" />
                  <div className="p-3">
                    <div className="text-sm font-medium text-[#0E2D1B]">{r.title}</div>
                    <div className="text-xs text-[#E58E26] mt-1">{r.minutesToRead ?? ""} min</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
