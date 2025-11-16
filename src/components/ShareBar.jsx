// src/components/ShareBar.jsx
import React from "react";

/*
  Small share UI:
  - Copy link (uses navigator.clipboard)
  - Twitter / Facebook share links (opens new window)
  - Keep simple and accessible
*/

export default function ShareBar({ post }) {
  const url = typeof window !== "undefined" ? window.location.origin + `/blog/${post?.id}` : `/blog/${post?.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Post link copied to clipboard");
    } catch (e) {
      console.error(e);
      alert("Copy failed — please copy manually: " + url);
    }
  };

  const openWindow = (href) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        title="Copy link"
        className="p-1 rounded hover:bg-gray-100"
        aria-label="Copy link"
      >
        🔗
      </button>

      <button
        onClick={() => openWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title)}&url=${encodeURIComponent(url)}`)}
        title="Share on Twitter"
        className="p-1 rounded hover:bg-gray-100"
        aria-label="Share on Twitter"
      >
        🐦
      </button>

      <button
        onClick={() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
        title="Share on Facebook"
        className="p-1 rounded hover:bg-gray-100"
        aria-label="Share on Facebook"
      >
        👍
      </button>
    </div>
  );
}
