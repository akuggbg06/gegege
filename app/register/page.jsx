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
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src="https://files.catbox.moe/t4osuc.mp4" type="video/mp4" />
      </video>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        borderRadius: '28px',
        padding: '2.2rem 1.8rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" style={{ width: '28px', height: '28px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'white', marginTop: '1rem', marginBottom: '0.3rem' }}>Create Account</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>Daftar akun baru</p>
        </div>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '16px', padding: '0.75rem', marginBottom: '1rem', color: '#fecaca', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>👤 Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                outline: 'none',
                color: 'white',
                fontFamily: 'inherit'
              }}
              placeholder="Pilih username"
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>📧 Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                outline: 'none',
                color: 'white',
                fontFamily: 'inherit'
              }}
              placeholder="Email aktif"
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>🔒 Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                outline: 'none',
                color: 'white',
                fontFamily: 'inherit'
              }}
              placeholder="Buat password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.85rem',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '1rem' }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
