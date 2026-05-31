'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageCard from '@/components/ImageCard';
import VideoCard from '@/components/VideoCard';
import UploadModal from '@/components/UploadModal';
import BroadcastBanner from '@/components/BroadcastBanner';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('semua');

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
      setLoading(false);
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
        setImages(data.images || []);
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('Gagal load media:', error);
    }
  };

  const handleUploadComplete = () => {
    loadMedia();
  };

  const semuaMedia = [...images, ...videos].sort((a, b) => 
    new Date(b.uploaded_at) - new Date(a.uploaded_at)
  );

  const filteredMedia = () => {
    if (activeTab === 'semua') return semuaMedia;
    if (activeTab === 'foto') return images;
    if (activeTab === 'video') return videos;
    if (activeTab === 'public') return semuaMedia.filter(m => m.visibility === 'public');
    if (activeTab === 'owner') return semuaMedia.filter(m => m.visibility === 'owner');
    return semuaMedia;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar user={user} />
      <BroadcastBanner />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Zexzo Storage
          </h1>
          <p className="text-gray-400 mt-2">Kelola foto dan video kamu dengan mudah</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl mb-1">📸</div>
            <div className="text-2xl font-bold text-white">{images.length}</div>
            <div className="text-xs text-gray-400">Foto</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl mb-1">🎬</div>
            <div className="text-2xl font-bold text-white">{videos.length}</div>
            <div className="text-xs text-gray-400">Video</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl mb-1">👁️</div>
            <div className="text-2xl font-bold text-white">{semuaMedia.filter(m => m.visibility === 'public').length}</div>
            <div className="text-xs text-gray-400">Publik</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl mb-1">🔒</div>
            <div className="text-2xl font-bold text-white">{semuaMedia.filter(m => m.visibility === 'owner').length}</div>
            <div className="text-xs text-gray-400">Owner Only</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'semua', icon: '🎯', label: 'Semua' },
            { id: 'foto', icon: '📸', label: 'Foto' },
            { id: 'video', icon: '🎬', label: 'Video' },
            { id: 'public', icon: '🌍', label: 'Publik' },
            { id: 'owner', icon: '🔒', label: 'Owner Only' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span className="mr-1">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {filteredMedia().length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-lg">Belum ada media</p>
            <p className="text-gray-500 text-sm mt-1">Klik tombol + untuk upload foto atau video</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredMedia().map((item) => (
              item.type === 'video' ? (
                <VideoCard key={item._id || item.id} video={item} onDelete={loadMedia} />
              ) : (
                <ImageCard key={item._id || item.id} image={item} onDelete={loadMedia} />
              )
            ))}
          </div>
        )}
      </div>

      {/* Floating Upload Button */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold text-white hover:scale-110 transition-all duration-300 z-50 hover:shadow-purple-500/50"
      >
        +
      </button>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
