import React from "react";
import PageHead from "../components/PageHead";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <PageHead title="404 — Not Found" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4">Page not found.</p>
      <Link to="/" className="mt-6 inline-block px-4 py-2 bg-[#E58E26] text-white rounded">Home</Link>
    </div>
  );
}
