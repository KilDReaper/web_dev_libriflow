"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export default function EditUserPage() {
  const { id } = useParams();
  const [role, setRole] = useState("user");

  const handleUpdate = async () => {
    await api.put(`/admin/users/${id}`, { role });
    alert("Updated");
  };

  return (
    <div>
      <h2>Edit User</h2>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleUpdate}>Save</button>
    </div>
  );
}
