'use client';

import { useEffect, useState } from 'react';

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
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
        <p style={{
          fontSize: '0.7rem',
          color: '#ccc',
          marginTop: '2rem'
        }}>
          Redirect ke halaman utama dalam {countdown} detik...
        </p>
      </div>
    </div>
  );
}
