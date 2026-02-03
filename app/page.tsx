"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/profile").then(res => setUser(res.data.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <h2>Welcome, {user.username}</h2>

      <div style={grid}>
        <Card title="Library" link="/library" />
        <Card title="Search" link="/search" />
        <Card title="Profile" link="/user/profile" />

        {user.role === "admin" && (
          <Card title="Admin Panel" link="/admin/users" />
        )}
      </div>
    </>
  );
}

function Card({ title, link }: { title: string; link: string }) {
  return (
    <Link href={link} style={{ textDecoration: "none", color: "black" }}>
      <div style={card}>
        <h3>{title}</h3>
      </div>
    </Link>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 8,
  textAlign: "center" as const,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};
