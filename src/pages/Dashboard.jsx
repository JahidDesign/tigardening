import React from "react";
import PageHead from "../components/PageHead";
import { useStore } from "../store/useStore";

export default function Dashboard() {
  const user = useStore((s) => s.user);
  return (
    <div>
      <PageHead title="Dashboard — TriGardening" />
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome, {user?.displayName || user?.email || "user"}!</p>
    </div>
  );
}
