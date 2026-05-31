const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // 🔧 SIMPAN TOKEN KE LOCALSTORAGE
      localStorage.setItem('token', data.token);
      // LANGSUNG REDIRECT KE DASHBOARD
      window.location.href = '/dashboard';
    } else {
      setError(data.error || 'Login gagal, Bos!');
      setLoading(false);
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Terjadi kesalahan, coba lagi nanti, Bos!');
    setLoading(false);
  }
};
