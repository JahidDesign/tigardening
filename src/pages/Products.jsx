import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

export default function Products() {
  const INITIAL = 6;
  const STEP = 3;

  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(INITIAL);
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  const reduced = useReducedMotion();

  // ⬇️ Load from JSON
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleProducts = products.slice(0, visible);

  const containerVariants = reduced
    ? undefined
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08, when: "beforeChildren" },
        },
      };

  // ⭐ Alternate direction animation
  // Even = left, Odd = right
  const cardVariant = (i) =>
    reduced
      ? {}
      : {
          hidden: {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50, // 👈 LEFT or RIGHT
            scale: 0.96,
          },
          show: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 240,
              damping: 22,
            },
          },
        };

  const toggleCart = (id) =>
    setCart((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <main className="bg-[#F6F6EE] min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0E2D1B]">
            Our Products
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our range of plants, fertilizers and gardening tools.
          </p>
        </header>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {visibleProducts.map((p, i) => (
            <motion.article
              key={p.id}
              variants={cardVariant(i)}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 w-full">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <span className="text-xs text-gray-500">{p.category}</span>
                <h3 className="text-lg font-semibold text-[#0E2D1B] mt-1">
                  {p.name}
                </h3>

                <p className="mt-3 text-[#E58E26] font-semibold">
                  {p.priceLabel}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => toggleCart(p.id)}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                      cart.includes(p.id)
                        ? "bg-[#0E2D1B] text-white"
                        : "bg-[#E58E26] text-white hover:bg-[#f7a23a]"
                    }`}
                  >
                    {cart.includes(p.id) ? "Added" : "Add to cart"}
                  </button>

                  <Link
                    to={`/products/${p.id}`}
                    className="py-2 px-3 rounded-full border border-gray-200 text-sm text-[#0E2D1B] hover:bg-gray-50"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {visible < products.length && (
            <button
              onClick={() => setVisible((v) => v + STEP)}
              className="bg-[#E58E26] text-white px-6 py-2 rounded-full hover:bg-[#f7a23a]"
            >
              Show more
            </button>
          )}

          {visible > INITIAL && (
            <button
              onClick={() => {
                setVisible(INITIAL);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-white border border-gray-200 text-[#0E2D1B] px-6 py-2 rounded-full hover:bg-gray-50"
            >
              Show less
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
