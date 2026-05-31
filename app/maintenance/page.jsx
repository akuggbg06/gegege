'use client';

import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: '6rem',
          marginBottom: '1rem'
        }}>🔧</div>
        <h1 style={{
          fontSize: '2rem',
          color: '#333',
          marginBottom: '1rem'
        }}>Sedang dalam maintenance</h1>
        <p style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: '0.5rem',
          lineHeight: '1.5'
        }}>
          Website sedang kami perbaiki untuk memberikan pengalaman terbaik.
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: '#999',
          marginBottom: '2rem'
        }}>
          Mohon bersabar, ya Bos! Kami akan kembali dalam waktu singkat.
        </p>
        <p style={{
          fontSize: '0.8rem',
          color: '#aaa'
        }}>
          Terima kasih atas pengertiannya 🙏
        </p>
      </div>
    </div>
  );
}
