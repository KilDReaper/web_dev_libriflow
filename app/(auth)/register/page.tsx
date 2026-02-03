'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          username,
          email,
          phoneNumber,
          password,
          confirmPassword,
        }
      );

      alert('Registration successful!');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        placeholder="Role (user or admin)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
