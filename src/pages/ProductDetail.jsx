// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import PageHead from "../components/PageHead";
import Loader from "../components/Loader";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let mounted = true;
    // load whole JSON and find product by id
    fetch("/data/products.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load products");
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setAllProducts(data);
        const pid = Number(id);
        const found = data.find((x) => x.id === pid);
        setProduct(found || null);
      })
      .catch((e) => {
        console.error(e);
        setProduct(null);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    // simple persistence for cart in session (optional)
    const s = sessionStorage.getItem("cart");
    if (s) setCart(JSON.parse(s));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const toggleCart = (pid) =>
    setCart((prev) => (prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]));

  if (loading) return <Loader />;

  if (!product) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-[#F6F6EE]">
        <section className="max-w-4xl mx-auto px-6 text-center py-24">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find that product.</p>
          <div className="flex justify-center gap-4">
            <Link to="/products" className="px-4 py-2 bg-[#E58E26] text-white rounded">Back to products</Link>
            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Go back</button>
          </div>
        </section>
      </main>
    );
  }

  // related products: same category, excluding current
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const container = reduced
    ? {}
    : {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
      };

  const item = reduced
    ? {}
    : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <main className="bg-[#F6F6EE] min-h-screen pt-24 pb-20">
      <PageHead title={`${product.name} — TriGardening`} description={product.description || product.category} />

      <section className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate="show" variants={container} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Image */}
          <motion.div variants={item} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[420px] object-cover"
              loading="lazy"
              width="900"
              height="600"
            />
          </motion.div>

          {/* Right: Details */}
          <motion.div variants={item} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#0E2D1B]">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-[#E58E26]">{product.priceLabel}</p>
                <p className="text-xs text-gray-500 mt-1">Reviews: {product.reviews}</p>
              </div>
            </div>

            <div className="prose max-w-none text-gray-700">
              {/* description may be missing — fallback text */}
              <p>{product.description || "No detailed description available for this product yet."}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => toggleCart(product.id)}
                className={`flex-1 py-3 rounded-full font-medium transition ${
                  cart.includes(product.id) ? "bg-[#0E2D1B] text-white" : "bg-[#E58E26] text-white hover:bg-[#f7a23a]"
                }`}
                aria-pressed={cart.includes(product.id)}
              >
                {cart.includes(product.id) ? "Added to cart" : "Add to cart"}
              </button>

              <Link to="/cart" className="py-3 px-4 rounded-full border text-[#0E2D1B] text-center">
                View cart
              </Link>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p><strong>SKU:</strong> {product.id}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Related items</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {related.map((rp) => (
                <motion.article key={rp.id} variants={item} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Link to={`/products/${rp.id}`} className="block">
                    <img src={rp.image} alt={rp.name} className="w-full h-32 object-cover" loading="lazy" />
                    <div className="p-3">
                      <p className="text-sm font-medium text-[#0E2D1B]">{rp.name}</p>
                      <p className="text-xs text-[#E58E26] mt-1">{rp.priceLabel}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
