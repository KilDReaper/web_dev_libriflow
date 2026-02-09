"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then((res) => setUser(res.data.data));
  }, [id]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Fetching user details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-sm text-gray-500 mt-1">ID: {id}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {user.role?.toUpperCase() || 'USER'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Full Name</p>
              <p className="text-lg font-medium text-gray-900">{user.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Email Address</p>
              <p className="text-lg font-medium text-gray-900">{user.email || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Activity</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Joined On</p>
              <p className="text-lg font-medium text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Last Login</p>
              <p className="text-lg font-medium text-gray-900">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">System Metadata (JSON)</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-indigo-300 font-mono text-sm leading-relaxed">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}