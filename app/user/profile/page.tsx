"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/profile").then(res => setUser(res.data.data));
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="p-1.5 bg-white rounded-full inline-block">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-md text-3xl font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all active:scale-95">
              Edit Settings
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">{user.username}</h1>
            <p className="text-indigo-600 font-medium">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">Email Address</p>
                <p className="text-slate-900 font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">Phone Number</p>
                <p className="text-slate-900 font-semibold">{user.phoneNumber || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}