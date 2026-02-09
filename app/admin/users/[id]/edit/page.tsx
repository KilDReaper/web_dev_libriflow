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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit User Permissions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Updating settings for User ID: <span className="font-mono text-indigo-600">{id}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Assign Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}