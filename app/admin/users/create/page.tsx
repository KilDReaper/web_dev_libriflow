'use client';

import axios from 'axios';
import { useState } from 'react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + '/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default function CreateUserPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [image, setImage] = useState<File | null>(null);

  const handleCreate = async () => {
    const formData = new FormData();

    formData.append('username', username);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);
    formData.append('role', role);

    if (image) {
      formData.append('image', image); // MUST be "image"
    }

    await api.post('/admin/users', formData);

    alert('User created successfully');
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-bold">Create User</h1>

      <input
        placeholder="Username"
        className="border p-2 w-full"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Phone Number"
        className="border p-2 w-full"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="border p-2 w-full"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create User
      </button>
    </div>
  );
}
