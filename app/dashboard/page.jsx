'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState('photo');
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPrivacy, setUploadPrivacy] = useState('public');

  useEffect(() => {
    checkAuth();
    loadMedia();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      localStorage.removeItem('token');
      router.push('/login');
    } else {
      const data = await res.json();
      setUser(data.user);
    }
  };

  const loadMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/media', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const allMedia = [...(data.images || []), ...(data.videos || [])];
        setMediaItems(allMedia);
      }
    } catch (error) {
      console.error('Gagal load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Pilih file dulu!');
      return;
    }
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('description', uploadName);
    formData.append('visibility', uploadPrivacy);
    formData.append('type', uploadType);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/media/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      alert('Upload berhasil!');
      setModalOpen(false);
      setUploadFile(null);
      setUploadName('');
      loadMedia();
    } else {
      alert('Upload gagal!');
    }
  };

  const handleDelete = async (id, type) => {
    if (confirm('Hapus media ini?')) {
      const token = localStorage.getItem('token');
      await fetch(`/api/media/${id}?type=${type}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadMedia();
    }
  };

  const filteredMedia = () => {
    let filtered = [...mediaItems];
    if (currentFilter === 'photo') filtered = filtered.filter(m => m.type === 'image');
    if (currentFilter === 'video') filtered = filtered.filter(m => m.type === 'video');
    if (currentFilter === 'public') filtered = filtered.filter(m => m.visibility === 'public');
    if (currentFilter === 'owner') filtered = filtered.filter(m => m.visibility === 'owner');
    return filtered;
  };

  const stats = {
    photos: mediaItems.filter(m => m.type === 'image').length,
    videos: mediaItems.filter(m => m.type === 'video').length,
    public: mediaItems.filter(m => m.visibility === 'public').length,
    owner: mediaItems.filter(m => m.visibility === 'owner').length
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #eef2ff 0%, #d9e4fc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: linear-gradient(145deg, #eef2ff 0%, #d9e4fc 100%); font-family: 'Inter', sans-serif; color: #0a2b3e; padding: 1.5rem 1rem 4rem; min-height: 100vh; }
        .app-container { max-width: 1280px; margin: 0 auto; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; background: rgba(255,255,255,0.35); backdrop-filter: blur(8px); border-radius: 2.5rem; padding: 0.8rem 1.8rem; box-shadow: 0 8px 20px rgba(0,30,60,0.08); border: 1px solid rgba(59,130,246,0.2); }
        .logo-area h1 { font-size: 1.8rem; font-weight: 700; background: linear-gradient(135deg, #1e3c72, #2b5f8a); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .logo-area span { font-size: 0.8rem; background: #2563eb20; padding: 0.2rem 0.7rem; border-radius: 40px; color: #1e4a8a; margin-left: 0.5rem; }
        .user-panel { display: flex; align-items: center; gap: 1.2rem; background: white; padding: 0.4rem 1.2rem 0.4rem 1rem; border-radius: 60px; border: 1px solid #bfdbfe; }
        .user-greeting { font-weight: 600; color: #0c4e6e; }
        .logout-btn { background: #fee2e2; border: none; padding: 6px 12px; border-radius: 40px; color: #ef4444; cursor: pointer; font-weight: 500; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.2rem; margin-bottom: 2rem; }
        .stat-card { background: white; border-radius: 1.8rem; padding: 1.2rem 0.8rem; text-align: center; box-shadow: 0 12px 25px -12px rgba(0,0,0,0.1); border: 1px solid rgba(59,130,246,0.2); }
        .stat-icon { font-size: 2.2rem; color: #2563eb; margin-bottom: 0.5rem; }
        .stat-number { font-size: 2.3rem; font-weight: 800; color: #0f2b3d; }
        .stat-label { font-weight: 500; color: #2c6280; margin-top: 6px; font-size: 0.85rem; }
        .filter-tabs { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 1.5rem 0 1.8rem; background: rgba(255,255,255,0.5); padding: 0.5rem; border-radius: 60px; backdrop-filter: blur(8px); }
        .filter-btn { background: transparent; border: none; padding: 0.6rem 1.4rem; border-radius: 40px; font-weight: 600; cursor: pointer; color: #1e4a76; display: flex; align-items: center; gap: 8px; }
        .filter-btn.active { background: #1e4bd2; color: white; box-shadow: 0 6px 14px rgba(30,75,210,0.3); }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; margin-top: 0.5rem; }
        .media-card { background: white; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 12px 22px -8px rgba(0,0,0,0.08); border: 1px solid #e2efff; cursor: pointer; position: relative; }
        .media-card:hover { transform: scale(1.01); border-color: #3b82f6; }
        .media-preview { aspect-ratio: 1 / 1; background: #f2f6fe; display: flex; align-items: center; justify-content: center; }
        .media-preview img, .media-preview video { width: 100%; height: 100%; object-fit: cover; }
        .privacy-badge { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); padding: 4px 8px; border-radius: 30px; font-size: 0.7rem; color: white; }
        .media-info { padding: 0.8rem; }
        .media-name { font-weight: 600; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .delete-btn { width: 100%; margin-top: 8px; padding: 4px; background: #fee2e2; border: none; border-radius: 20px; color: #ef4444; font-size: 0.7rem; cursor: pointer; }
        .empty-state { text-align: center; padding: 3rem 1rem; background: #ffffffb3; border-radius: 2rem; border: 1px dashed #73a9ff; }
        .floating-upload { position: fixed; bottom: 2rem; right: 2rem; background: #1f4fdb; color: white; width: 64px; height: 64px; border-radius: 40px; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 12px 25px #1e4bd280; cursor: pointer; border: none; z-index: 20; }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000; visibility: hidden; opacity: 0; transition: all 0.2s; }
        .modal.active { visibility: visible; opacity: 1; }
        .modal-content { background: white; width: 90%; max-width: 480px; border-radius: 2rem; padding: 1.6rem; border-top: 6px solid #2563eb; }
        .modal-content h3 { font-size: 1.6rem; margin-bottom: 1rem; }
        .form-group { margin: 1rem 0; }
        .form-group label { font-weight: 600; display: block; margin-bottom: 0.3rem; }
        input, select { width: 100%; padding: 0.8rem; border-radius: 1.2rem; border: 1px solid #cbd5e1; }
        .radio-group { display: flex; gap: 1rem; margin-top: 0.4rem; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
        .btn { padding: 0.6rem 1.4rem; border-radius: 2rem; border: none; font-weight: 600; cursor: pointer; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-secondary { background: #e4e7f0; }
        footer { text-align: center; margin-top: 3rem; color: #4b6b8f; font-size: 0.75rem; }
      `}</style>

      <div className="app-container">
        <div className="header-flex">
          <div className="logo-area"><h1>Zexzo Storage <span>✨ v2.0</span></h1></div>
          <div className="user-panel">
            <div className="user-greeting"><i className="fas fa-user-astronaut"></i> {user?.username}</div>
            <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}>Logout</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon">📸</div><div className="stat-number">{stats.photos}</div><div className="stat-label">Foto</div></div>
          <div className="stat-card"><div className="stat-icon">🎬</div><div className="stat-number">{stats.videos}</div><div className="stat-label">Video</div></div>
          <div className="stat-card"><div className="stat-icon">🌍</div><div className="stat-number">{stats.public}</div><div className="stat-label">Publik</div></div>
          <div className="stat-card"><div className="stat-icon">🔒</div><div className="stat-number">{stats.owner}</div><div className="stat-label">Owner Only</div></div>
        </div>

        <div className="filter-tabs">
          {['all','photo','video','public','owner'].map(filter => (
            <button key={filter} className={`filter-btn ${currentFilter === filter ? 'active' : ''}`} onClick={() => setCurrentFilter(filter)}>
              {filter === 'all' && '🎯 Semua'}
              {filter === 'photo' && '📸 Foto'}
              {filter === 'video' && '🎬 Video'}
              {filter === 'public' && '🌍 Publik'}
              {filter === 'owner' && '🔒 Owner'}
            </button>
          ))}
        </div>

        {filteredMedia().length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><h3>Belum ada media</h3><p>Klik tombol + untuk upload foto atau video</p></div>
        ) : (
          <div className="media-grid">
            {filteredMedia().map(item => (
              <div key={item._id || item.id} className="media-card">
                <div className="media-preview">
                  {item.type === 'image' ? (
                    <img src={item.media_url} alt={item.description || 'Foto'} />
                  ) : (
                    <video src={item.media_url} muted />
                  )}
                </div>
                <div className="privacy-badge">{item.visibility === 'public' ? '🌍 Publik' : '🔒 Owner'}</div>
                <div className="media-info">
                  <div className="media-name">{item.description || (item.type === 'image' ? 'Foto' : 'Video')}</div>
                  <button className="delete-btn" onClick={() => handleDelete(item._id || item.id, item.type)}>🗑️ Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <footer><i className="fas fa-database"></i> Zexzo Storage — aman & modern</footer>
      </div>

      <button className="floating-upload" onClick={() => setModalOpen(true)}>+</button>

      <div className={`modal ${modalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <h3>Upload Media</h3>
          <div className="form-group">
            <label>Jenis Media</label>
            <select value={uploadType} onChange={e => setUploadType(e.target.value)}>
              <option value="photo">📸 Foto</option>
              <option value="video">🎬 Video</option>
            </select>
          </div>
          <div className="form-group">
            <label>Deskripsi (opsional)</label>
            <input type="text" placeholder="Judul / deskripsi" value={uploadName} onChange={e => setUploadName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Pilih File</label>
            <input type="file" accept={uploadType === 'photo' ? 'image/*' : 'video/*'} onChange={e => setUploadFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label>Privacy</label>
            <div className="radio-group">
              <label><input type="radio" name="privacy" value="public" checked={uploadPrivacy === 'public'} onChange={() => setUploadPrivacy('public')} /> 🌍 Publik</label>
              <label><input type="radio" name="privacy" value="owner" checked={uploadPrivacy === 'owner'} onChange={() => setUploadPrivacy('owner')} /> 🔒 Owner Only</label>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Batal</button>
            <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
          </div>
        </div>
      </div>
    </>
  );
}
