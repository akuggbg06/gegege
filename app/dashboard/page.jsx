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
  const handleUploadComplete = () => loadMedia();
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
  
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>;
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      <div className="relative z-10">
        <Navbar user={user} />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.username} ✨</h1>
            <p className="text-white/60 mt-1">Kelola media kamu dengan gaya</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center"><div className="text-2xl">📸</div><div className="text-2xl font-bold text-white">{stats.photos}</div><div className="text-xs text-white/60">Foto</div></div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center"><div className="text-2xl">🎬</div><div className="text-2xl font-bold text-white">{stats.videos}</div><div className="text-xs text-white/60">Video</div></div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center"><div className="text-2xl">🌍</div><div className="text-2xl font-bold text-white">{stats.public}</div><div className="text-xs text-white/60">Publik</div></div>
            <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20 text-center"><div className="text-2xl">🔒</div><div className="text-2xl font-bold text-white">{stats.owner}</div><div className="text-xs text-white/60">Owner</div></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {['all','photos','videos','public','owner'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full font-medium backdrop-blur-xl transition ${activeTab === tab ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>{tab === 'all' ? 'Semua' : tab}</button>
            ))}
          </div>
          {filtered().length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 text-center border border-white/20"><div className="text-6xl mb-3">📭</div><p className="text-white/60">Belum ada media</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">{filtered().map(item => item.type === 'video' ? <VideoCard key={item.id} video={item} onDelete={loadMedia} /> : <ImageCard key={item.id} image={item} onDelete={loadMedia} />)}</div>
          )}
        </div>
        <button onClick={() => setIsUploadModalOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold hover:scale-110 transition">+</button>
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadComplete={handleUploadComplete} />
      </div>
    </div>
  );
}
