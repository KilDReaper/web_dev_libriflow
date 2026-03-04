"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem('token', res.data.token);
      router.push('/user/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-6">

      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="text-center mb-10">
              {/* Changed dimensions of the icon container */}
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 mt-2">Sign in to access your library</p>
            </div>
          title="AI Recommendations"
          description="Get smart book picks for your class or interests."
          link="/recommendations"
          icon="✨"
          color="bg-indigo-600"
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