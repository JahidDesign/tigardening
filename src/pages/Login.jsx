import React, { useState } from "react";
import PageHead from "../components/PageHead";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoadingGoogle(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingEmail(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
      let msg = "Login failed. Please check your email and password.";
      if (e.code === "auth/invalid-email") msg = "Invalid email address.";
      if (e.code === "auth/user-not-found") msg = "No user found with this email.";
      if (e.code === "auth/wrong-password") msg = "Incorrect password.";
      setError(msg);
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <>
      <PageHead title="Login — TriGardening" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0E2D1B]">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue to TriGardening
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#E58E26]/70"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                {/* Forgot Password link */}
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#E58E26] hover:text-[#c9781f]"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#E58E26]/70"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loadingEmail}
              className="w-full mt-2 rounded-lg bg-[#E58E26] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#c9781f] transition"
            >
              {loadingEmail ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-5 h-5"
              alt=""
            />
            {loadingGoogle ? "Connecting..." : "Sign in with Google"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#E58E26] font-semibold hover:text-[#c9781f]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
