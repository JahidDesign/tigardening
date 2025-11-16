// src/router.jsx
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Lazy pages (adjust paths if your files are located elsewhere)
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products").catch(() => ({ default: () => <div>Products Not Found</div> })));
const Blog = lazy(() => import("./pages/Blog").catch(() => ({ default: () => <div>Blog Not Found</div> })));
const PlantClinic = lazy(() => import("./pages/PlantClinic").catch(() => ({ default: () => <div>Plant Clinic Not Found</div> })));
const Cart = lazy(() => import("./pages/Cart").catch(() => ({ default: () => <div>Cart Not Found</div> })));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound").catch(() => ({ default: () => <div>Page not found</div> })));

// Simple spinner component used during Suspense/loading
function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="loader">Loading…</div>
    </div>
  );
}

// Hook that subscribes to Firebase auth state and returns { user, loading }
function useAuthState() {
  const [user, setUser] = useState(() => auth.currentUser || null);
  const [loading, setLoading] = useState(user === null);

  useEffect(() => {
    setLoading(true);
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}

// ProtectedRoute: shows spinner while auth initializing, redirects to /login if not authed
function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { user, loading } = useAuthState();
  const location = useLocation();

  if (loading) {
    // while verifying auth state, show a placeholder
    return <PageSpinner />;
  }

  if (!user) {
    // pass state so login page can redirect back after success
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/plantclinic" element={<PlantClinic />} />
        <Route path="/plant-clinic" element={<Navigate to="/plantclinic" replace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
