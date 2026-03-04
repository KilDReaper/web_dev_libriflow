"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

// Import components
import AdminDashboardContent from "./_components/AdminDashboardContent";
import LibraryContent from "./_components/LibraryContent";
import Sidebar from "./_components/Sidebar";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If admin, show dashboard
  if (user?.role === "admin") {
    return <AdminDashboardContent />;
  }

  // Otherwise show library with sidebar
  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <div className="flex-1 overflow-auto">
        <LibraryContent />
      </div>
    </div>
  );
}