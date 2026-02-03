"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [errorInfo, setErrorInfo] = useState<string>("");

  useEffect(() => {
    api.get("/admin/users")
      .then(res => {
        // This log is the most important part
        console.log("Full Response Object:", res);
        
        // Some backends wrap data in 'data', others 'users', others send the array directly
        const data = res.data?.data || res.data?.users || res.data;
        
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Data received is not an array:", data);
          setErrorInfo("Backend sent back something that wasn't a list.");
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setErrorInfo(err.response?.data?.message || "Failed to connect to backend");
      });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">All Users ({users.length})</h2>
      
      {errorInfo && <p className="text-red-500 mb-4">{errorInfo}</p>}

      <div className="space-y-2">
        {users.map((user, index) => (
          <div key={user._id || index} className="p-4 border rounded bg-white shadow-sm">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}