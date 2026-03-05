"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import BackButton from "@/app/_components/BackButton";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeUser = (payload: any) => {
    if (!payload) return null;
    return payload.user || payload.profile || payload.account || payload;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/admin/users/${id}`);
        const userData = res.data?.data ?? res.data;
        setUser(normalizeUser(userData));
      } catch (err: any) {
        console.error("Failed to fetch user:", err);
        setError(err.response?.data?.message || "Failed to load user details. Please try again.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium mt-4">Fetching user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <BackButton className="mb-6" />
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load User</h2>
            <p className="text-gray-600 mb-6">
              {error || "The user details could not be retrieved. Please try again later."}
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userName =
    user.username ||
    user.name ||
    user.fullName ||
    user.userName ||
    user.displayName ||
    "N/A";

  const userEmail =
    user.email ||
    user.emailAddress ||
    user.contact?.email ||
    "N/A";

  const userPhone =
    user.phoneNumber ||
    user.phone ||
    user.mobile ||
    user.contactNumber ||
    user.contact?.phone ||
    "Not provided";

  const userRole = (user.role || user.userRole || "user").toString().toLowerCase();
  const createdAt = user.createdAt || user.joinedAt || user.created_on;
  const lastLogin = user.lastLogin || user.lastLoginAt || user.updatedAt;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton className="mb-6" />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-500 text-sm mt-2">ID: {id}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              userRole === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {userRole.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Account Information */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Username</p>
                <p className="text-lg font-medium text-gray-900">{userName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                <p className="text-lg font-medium text-gray-900 break-all">{userEmail}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Phone Number</p>
                <p className="text-lg font-medium text-gray-900">{userPhone}</p>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Activity
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Joined On</p>
                <p className="text-lg font-medium text-gray-900">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Last Login</p>
                <p className="text-lg font-medium text-gray-900">
                  {lastLogin
                    ? new Date(lastLogin).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Never logged in"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Status & Settings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <div>
                <p className="text-xs text-gray-500 uppercase">Status</p>
                <p className="text-sm font-semibold text-gray-900">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <span
                className={`h-3 w-3 rounded-full ${
                  userRole === "admin" ? "bg-purple-500" : "bg-blue-500"
                }`}
              ></span>
              <div>
                <p className="text-xs text-gray-500 uppercase">Role</p>
                <p className="text-sm font-semibold text-gray-900">
                  {userRole === "admin" ? "Administrator" : "Regular User"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/admin/users/${id}/edit`)}
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit User
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Raw JSON Data (for debugging) */}
        <div className="bg-gray-900 rounded-xl overflow-hidden mt-6">
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Raw Data (JSON)</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-green-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}