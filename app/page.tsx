"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/profile").then(res => setUser(res.data.data));
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <header className="mb-10">
        <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">Overview</h2>
        <h1 className="text-4xl font-black text-slate-900">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user.username}</span> 👋
        </h1>
        <p className="text-slate-500 mt-2 text-lg">What would you like to do today?</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          title="Library" 
          description="Access your saved books and resources."
          link="/library" 
          icon="📚"
          color="bg-blue-500"
        />
        <Card 
          title="Search" 
          description="Find specific topics or documentation."
          link="/search" 
          icon="🔍"
          color="bg-amber-500"
        />
        <Card 
          title="Profile" 
          description="Manage your account settings and bio."
          link="/user/profile" 
          icon="👤"
          color="bg-emerald-500"
        />

        {user.role === "admin" && (
          <div className="sm:col-span-2 lg:col-span-3 mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-slate-200 flex-grow"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Administrative Tools</span>
              <div className="h-px bg-slate-200 flex-grow"></div>
            </div>
            <Card 
              title="Admin Panel" 
              description="Manage users, permissions, and system health."
              link="/admin/users" 
              icon="🛡️"
              color="bg-rose-600"
              isAdmin
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, description, link, icon, color, isAdmin = false }: any) {
  return (
    <Link href={link} className="group">
      <div className={`h-full p-8 rounded-3xl transition-all duration-300 border ${
        isAdmin 
        ? "bg-slate-900 border-slate-800 hover:bg-slate-800 shadow-xl shadow-rose-900/10" 
        : "bg-white border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
      }`}>
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isAdmin ? "text-white" : "text-slate-900"}`}>
          {title}
        </h3>
        <p className={`text-sm leading-relaxed ${isAdmin ? "text-slate-400" : "text-slate-500"}`}>
          {description}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${isAdmin ? "text-rose-400" : "text-indigo-600"}`}>
            Open Module
          </span>
          <svg className={`w-4 h-4 transform group-hover:translate-x-1 transition-transform ${isAdmin ? "text-rose-400" : "text-indigo-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}