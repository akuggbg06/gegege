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
      setError(data.error || 'Register gagal, Bos!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Zexzo Storage
          </h1>
          <p className="text-gray-400 mt-2">Buat akun baru, Bos</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 mb-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input-modern w-full"
              placeholder="Pilih username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-modern w-full"
              placeholder="Email aktif"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-modern w-full"
              placeholder="Buat password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'DAFTAR'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Udah punya akun?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
