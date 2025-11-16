import React from "react";
import { motion } from "framer-motion";
import PageHead from "../components/PageHead";
import Carousel from "./Carousel";
import ProductsPage from "./ProductsPage";
import FloweringPlant from "./FloweringPlant";
import FruitTreesPage from "./FruitTreesPage";

export default function Home() {
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "GardenStore",
    "name": "TriGardening",
    "url": "https://yourwebsite.com/",
    "description":
      "Buy healthy indoor and outdoor plants online with fast delivery. Shop houseplants, succulents, herbs, pots, soil, and gardening tools.",
    "image": "https://yourwebsite.com/og-image.jpg",
    "sameAs": [
      "https://facebook.com/yourpage",
      "https://instagram.com/yourpage"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Your Country"
    }
  };

  return (
    <>
      {/* SEO / Meta */}
      <PageHead
        title="Buy Plants Online | Fresh Indoor & Outdoor Plants Delivered | TriGardening"
        description="Shop fresh indoor and outdoor plants, gardening tools, pots, soil, fertilizers, and more. Fast delivery, healthy plants, and eco-friendly gardening supplies at TriGardening."
        keywords="buy plants online, online plant store, plant nursery online, indoor plants for sale, outdoor plants for sale, houseplants online, garden tools online, succulents, rare plants, eco-friendly gardening supplies"
        url="https://yourwebsite.com/"
        image="https://yourwebsite.com/og-image.jpg"
        jsonLd={homeJsonLd}
      />

      {/* Page Wrapper */}
      <div className="home-page">
        {/* Hero / Carousel Section */}
        <section className="home-hero">
          <Carousel />
        </section>

        {/* Main Content */}
        <motion.main
          className="home-main"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <section className="home-products">
            <ProductsPage />
          </section>
          <section className="home-products">
            <FloweringPlant />
          </section>
          <section className="home-products">
            <FruitTreesPage />
          </section>
        </motion.main>
      </div>
    </>
  );
}
