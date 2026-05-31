'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageCard from '@/components/ImageCard';
import VideoCard from '@/components/VideoCard';
import UploadModal from '@/components/UploadModal';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { checkAuth(); loadMedia(); }, []);
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) { localStorage.removeItem('token'); router.push('/login'); } 
    else { const data = await res.json(); setUser(data.user); setLoading(false); }
  };
  const loadMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/media', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setImages(data.images || []); setVideos(data.videos || []); }
    } catch (error) { console.error(error); }
  };
  const allMedia = [...images, ...videos];
  const filtered = () => {
    if (activeTab === 'all') return allMedia;
    if (activeTab === 'photos') return images;
    if (activeTab === 'videos') return videos;
    if (activeTab === 'public') return allMedia.filter(m => m.visibility === 'public');
    if (activeTab === 'owner') return allMedia.filter(m => m.visibility === 'owner');
    return allMedia;
  };
  const stats = { photos: images.length, videos: videos.length, public: allMedia.filter(m => m.visibility === 'public').length, owner: allMedia.filter(m => m.visibility === 'owner').length };
  
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}><div style={{ border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', width: 40, height: 40, animation: 'spin 1s linear infinite' }}></div><style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style></div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Navbar user={user} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 16px 32px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Selamat datang, {user?.username}!</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Kelola semua foto dan video kamu di sini</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}><div style={{ fontSize: 32, marginBottom: 8 }}>📸</div><div style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>{stats.photos}</div><div style={{ fontSize: 12, color: '#6b7280' }}>Total Foto</div></div>
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}><div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div><div style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>{stats.videos}</div><div style={{ fontSize: 12, color: '#6b7280' }}>Total Video</div></div>
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}><div style={{ fontSize: 32, marginBottom: 8 }}>🌍</div><div style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>{stats.public}</div><div style={{ fontSize: 12, color: '#6b7280' }}>Publik</div></div>
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}><div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div><div style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>{stats.owner}</div><div style={{ fontSize: 12, color: '#6b7280' }}>Owner Only</div></div>
        </div>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
          {['all','photos','videos','public','owner'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 500, backgroundColor: activeTab === tab ? '#3b82f6' : 'transparent', color: activeTab === tab ? 'white' : '#6b7280', border: 'none', cursor: 'pointer' }}>{tab === 'all' ? 'Semua' : tab}</button>
          ))}
        </div>
        
        {filtered().length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><div style={{ fontSize: 48, marginBottom: 16 }}>📭</div><p style={{ color: '#6b7280' }}>Belum ada media</p><p style={{ color: '#9ca3af', fontSize: 14, marginTop: 8 }}>Klik tombol + untuk upload foto atau video</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>{filtered().map(item => item.type === 'video' ? <VideoCard key={item._id || item.id} video={item} onDelete={loadMedia} /> : <ImageCard key={item._id || item.id} image={item} onDelete={loadMedia} />)}</div>
        )}
      </div>
      
      <button onClick={() => setIsUploadModalOpen(true)} style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 999, fontSize: 24, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>+</button>
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadComplete={loadMedia} />
    </div>
  );
}
