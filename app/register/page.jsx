'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError(data.error || 'Register gagal, kontol!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">INORYA</h1>
          <p className="text-gray-400 mt-2">Buat akun baru, babi</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-2 font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'DAFTAR'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-4 text-sm">
          Udah punya akun? <Link href="/login" className="text-red-500 hover:underline">Login sini</Link>
        </p>
      </div>
    </div>
  );
}
