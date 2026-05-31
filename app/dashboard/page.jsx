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
  const [uploadType, setUploadType] = useState('image');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadPrivacy, setUploadPrivacy] = useState('public');
  const [uploading, setUploading] = useState(false);

  // Cek auth dan load media
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      alert('Hanya file gambar atau video!');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('Maksimal 50MB!');
      return;
    }

    setUploadFile(file);
    setUploadType(isImage ? 'image' : 'video');
    const previewUrl = URL.createObjectURL(file);
    setUploadPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Pilih file dulu!');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('description', uploadDescription);
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
      setUploadPreview(null);
      setUploadDescription('');
      setUploadPrivacy('public');
      loadMedia();
    } else {
      const error = await res.json();
      alert('Upload gagal: ' + (error.error || 'Coba lagi'));
    }
    setUploading(false);
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

  const handleViewMedia = (url) => {
    window.open(url, '_blank');
  };

  const filteredMedia = () => {
    let filtered = [...mediaItems];
    if (currentFilter === 'photo') filtered = filtered.filter(m => m.type === 'image');
    if (currentFilter === 'video') filtered = filtered.filter(m => m.type === 'video');
    if (currentFilter === 'public') filtered = filtered.filter(m => m.visibility === 'public');
    if (currentFilter === 'owner') {
      // Owner only: hanya tampil kalo user adalah owner
      if (user?.username === 'UdudEnak' || user?.role === 'owner') {
        filtered = filtered.filter(m => m.visibility === 'owner');
      } else {
        filtered = [];
      }
    }
    return filtered;
  };

  const stats = {
    photos: mediaItems.filter(m => m.type === 'image').length,
    videos: mediaItems.filter(m => m.type === 'video').length,
    public: mediaItems.filter(m => m.visibility === 'public').length,
    owner: mediaItems.filter(m => m.visibility === 'owner').length
  };

  // Cek apakah user adalah owner (bisa lihat owner only)
  const isOwner = user?.username === 'UdudEnak' || user?.role === 'owner';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #eef2ff 0%, #d9e4fc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
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
        .stat-card { background: white; border-radius: 1.8rem; padding: 1.2rem 0.8rem; text-align: center; box-shadow: 0 12px 25px -12px rgba(0,0,0,0.1); border: 1px solid rgba(59,130,246,0.2); transition: 0.2s; }
        .stat-card:hover { transform: translateY(-3px); border-color: #3b82f6; }
        .stat-icon { font-size: 2.2rem; color: #2563eb; margin-bottom: 0.5rem; }
        .stat-number { font-size: 2.3rem; font-weight: 800; color: #0f2b3d; }
        .stat-label { font-weight: 500; color: #2c6280; margin-top: 6px; font-size: 0.85rem; }
        .filter-tabs { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 1.5rem 0 1.8rem; background: rgba(255,255,255,0.5); padding: 0.5rem; border-radius: 60px; backdrop-filter: blur(8px); }
        .filter-btn { background: transparent; border: none; padding: 0.6rem 1.4rem; border-radius: 40px; font-weight: 600; cursor: pointer; color: #1e4a76; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .filter-btn.active { background: #1e4bd2; color: white; box-shadow: 0 6px 14px rgba(30,75,210,0.3); }
        .filter-btn:not(.active):hover { background: #e0edff; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; margin-top: 0.5rem; }
        .media-card { background: white; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 12px 22px -8px rgba(0,0,0,0.08); border: 1px solid #e2efff; cursor: pointer; position: relative; transition: 0.2s; }
        .media-card:hover { transform: scale(1.01); border-color: #3b82f6; box-shadow: 0 20px 25px -12px #2563eb30; }
        .media-preview { aspect-ratio: 1 / 1; background: #f2f6fe; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .media-preview img, .media-preview video { width: 100%; height: 100%; object-fit: cover; }
        .privacy-badge { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); padding: 4px 8px; border-radius: 30px; font-size: 0.7rem; font-weight: 500; color: white; z-index: 2; }
        .media-info { padding: 0.8rem; }
        .media-name { font-weight: 600; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
        .media-date { font-size: 0.7rem; color: #6c757d; margin-bottom: 8px; }
        .delete-btn { width: 100%; padding: 6px; background: #fee2e2; border: none; border-radius: 20px; color: #ef4444; font-size: 0.7rem; cursor: pointer; font-weight: 500; transition: 0.2s; }
        .delete-btn:hover { background: #fecaca; }
        .empty-state { text-align: center; padding: 3rem 1rem; background: #ffffffb3; border-radius: 2rem; border: 1px dashed #73a9ff; }
        .empty-icon { font-size: 4rem; color: #6c9eff; margin-bottom: 1rem; }
        .floating-upload { position: fixed; bottom: 2rem; right: 2rem; background: #1f4fdb; color: white; width: 64px; height: 64px; border-radius: 40px; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 12px 25px #1e4bd280; cursor: pointer; border: none; z-index: 20; transition: 0.2s; }
        .floating-upload:hover { background: #0a3a9e; transform: scale(1.05); }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000; visibility: hidden; opacity: 0; transition: all 0.2s; }
        .modal.active { visibility: visible; opacity: 1; }
        .modal-content { background: white; width: 90%; max-width: 480px; border-radius: 2rem; padding: 1.6rem; border-top: 6px solid #2563eb; }
        .modal-content h3 { font-size: 1.6rem; font-weight: 600; margin-bottom: 1rem; }
        .form-group { margin: 1rem 0; }
        .form-group label { font-weight: 600; display: block; margin-bottom: 0.3rem; }
        input, select { width: 100%; padding: 0.8rem; border-radius: 1.2rem; border: 1px solid #cbd5e1; font-family: inherit; }
        .radio-group { display: flex; gap: 1rem; margin-top: 0.4rem; }
        .preview-image { width: 100%; border-radius: 1rem; margin-top: 0.5rem; }
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
          <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>🎯 Semua</button>
          <button className={`filter-btn ${currentFilter === 'photo' ? 'active' : ''}`} onClick={() => setCurrentFilter('photo')}>📸 Foto</button>
          <button className={`filter-btn ${currentFilter === 'video' ? 'active' : ''}`} onClick={() => setCurrentFilter('video')}>🎬 Video</button>
          <button className={`filter-btn ${currentFilter === 'public' ? 'active' : ''}`} onClick={() => setCurrentFilter('public')}>🌍 Publik</button>
          {isOwner && (
            <button className={`filter-btn ${currentFilter === 'owner' ? 'active' : ''}`} onClick={() => setCurrentFilter('owner')}>🔒 Owner</button>
          )}
        </div>

        {filteredMedia().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Belum ada media</h3>
            <p>Klik tombol + untuk upload foto atau video</p>
          </div>
        ) : (
          <div className="media-grid">
            {filteredMedia().map(item => (
              <div key={item._id || item.id} className="media-card">
                <div className="media-preview" onClick={() => handleViewMedia(item.media_url)}>
                  {item.type === 'image' ? (
                    <img src={item.media_url} alt={item.description || 'Foto'} loading="lazy" />
                  ) : (
                    <video src={item.media_url} muted />
                  )}
                </div>
                <div className="privacy-badge">{item.visibility === 'public' ? '🌍 Publik' : '🔒 Owner'}</div>
                <div className="media-info">
                  <div className="media-name">{item.description || (item.type === 'image' ? 'Foto' : 'Video')}</div>
                  <div className="media-date">📅 {new Date(item.uploaded_at).toLocaleDateString('id-ID')}</div>
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
          {!uploadFile ? (
            <div className="form-group">
              <label>Pilih File</label>
              <input type="file" accept="image/*,video/*" onChange={handleFileSelect} />
              <p style={{ fontSize: '0.7rem', color: '#6c757d', marginTop: '0.5rem' }}>Maksimal 50MB (JPG, PNG, GIF, MP4, WebM)</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Preview</label>
                {uploadType === 'image' ? (
                  <img src={uploadPreview} alt="Preview" className="preview-image" />
                ) : (
                  <video src={uploadPreview} controls className="preview-image" />
                )}
              </div>
              <div className="form-group">
                <label>Deskripsi (opsional)</label>
                <input type="text" placeholder="Judul atau deskripsi" value={uploadDescription} onChange={e => setUploadDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Privacy</label>
                <div className="radio-group">
                  <label><input type="radio" name="privacy" value="public" checked={uploadPrivacy === 'public'} onChange={() => setUploadPrivacy('public')} /> 🌍 Publik</label>
                  <label><input type="radio" name="privacy" value="owner" checked={uploadPrivacy === 'owner'} onChange={() => setUploadPrivacy('owner')} /> 🔒 Owner Only</label>
                </div>
              </div>
            </>
          )}
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => { setModalOpen(false); setUploadFile(null); setUploadPreview(null); setUploadDescription(''); setUploadPrivacy('public'); }}>Batal</button>
            <button className="btn btn-primary" onClick={handleUpload} disabled={!uploadFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
