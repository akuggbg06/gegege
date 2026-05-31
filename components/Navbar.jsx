'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({ user }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '12px 24px', zIndex: 50 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Z</div>
          <span style={{ fontWeight: 'bold', fontSize: 18 }}>Zexzo Storage</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ color: '#4b5563' }}>👋 Halo, {user?.username}</span>
          <button onClick={handleLogout} style={{ backgroundColor: '#fee2e2', border: 'none', padding: '6px 16px', borderRadius: 20, color: '#ef4444', fontWeight: 500, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
