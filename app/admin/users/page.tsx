"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/admin/users")
      .then(res => setUsers(res.data.data))
      .catch(() => alert("Admins only"));
  }, []);

  return (
    <div>
      <h2>All Users</h2>

      {users.map(u => (
        <div key={u._id} style={item}>
          {u.username} ({u.role})
        </div>
      ))}
    </div>
  );
}

const item = {
  background: "white",
  padding: 14,
  marginBottom: 8,
  borderRadius: 6,
};
