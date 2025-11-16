import React from "react";
import PageHead from "../components/PageHead";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDemoEmail = async () => {
    try {
      // demo account — replace with real flow
      await signInWithEmailAndPassword(auth, "demo@example.com", "demopassword");
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageHead title="Login — TriGardening" />
      <h1 className="text-2xl font-bold">Login</h1>
      <div className="mt-4 space-y-2">
        <button onClick={handleGoogle} className="px-4 py-2 bg-[#E58E26] rounded text-white">Sign in with Google</button>
        <button onClick={handleDemoEmail} className="px-4 py-2 border rounded">Demo email login</button>
      </div>
    </div>
  );
}
