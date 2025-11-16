import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox!");
    } catch (e) {
      console.error(e);
      setMessage("Error sending reset email.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      {message && <p className="text-green-600 mb-3">{message}</p>}

      <form onSubmit={resetPassword} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-[#E58E26] text-white py-2 rounded">
          Send Reset Email
        </button>
      </form>

      <p className="text-center text-sm mt-3">
        Back to{" "}
        <Link className="text-[#E58E26]" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
