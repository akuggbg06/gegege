'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError(data.error || 'Login gagal, Bos!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(145deg, #1e4a8a 0%, #0f2b4d 100%)',
      fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Roboto', sans-serif"
    }}>
      <div style={{
        background: 'white',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '28px',
        padding: '2.2rem 1.8rem',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#2563eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 4px 8px rgba(37, 99, 235, 0.2)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '28px', height: '28px', color: 'white' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.6rem', fontWeight: '600', color: '#0f2b4d', marginBottom: '0.3rem' }}>Welcome Back</h2>
        <div style={{ color: '#6c757d', fontSize: '0.85rem', marginBottom: '1.8rem' }}>Masukkan akun untuk melanjutkan</div>
        
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '16px', padding: '0.75rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>👤 Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                background: '#f8fafc',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              placeholder="Masukkan username"
              required
            />
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.5rem' }}>🔒 Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                background: '#f8fafc',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              placeholder="Masukkan password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#2563eb',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
            onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.background = '#2563eb'}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          Belum punya akun? <Link href="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
}
