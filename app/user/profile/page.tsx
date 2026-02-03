"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/profile").then(res => setUser(res.data.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={card}>
      <h2>My Profile</h2>

      {user.avatarUrl && (
        <img
          src={user.avatarUrl}
          width={120}
          height={120}
          style={{ borderRadius: "50%", marginBottom: 16 }}
        />
      )}

      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phoneNumber}</p>
    </div>
  );
}

const card = {
  background: "white",
  padding: 24,
  borderRadius: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};
