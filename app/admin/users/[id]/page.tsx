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

  if (!user) return <p>Loading...</p>;

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
