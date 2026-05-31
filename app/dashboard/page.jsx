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

  const allMedia = [...images, ...videos].sort((a, b) => 
    new Date(b.uploaded_at) - new Date(a.uploaded_at)
  );

  const getFilteredMedia = () => {
    if (activeTab === 'all') return allMedia;
    if (activeTab === 'photos') return images;
    if (activeTab === 'videos') return videos;
    if (activeTab === 'public') return allMedia.filter(m => m.visibility === 'public');
    if (activeTab === 'owner') return allMedia.filter(m => m.visibility === 'owner');
    return allMedia;
  };

  const stats = {
    photos: images.length,
    videos: videos.length,
    public: allMedia.filter(m => m.visibility === 'public').length,
    owner: allMedia.filter(m => m.visibility === 'owner').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {user?.username}!</h1>
          <p className="text-gray-500 mt-1">Kelola semua foto dan video kamu di sini</p>
        </div>

        {/* Stats Grid - Clean Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Foto</p>
                <p className="text-2xl font-bold text-gray-800">{stats.photos}</p>
              </div>
              <div className="text-2xl text-blue-500">📸</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Video</p>
                <p className="text-2xl font-bold text-gray-800">{stats.videos}</p>
              </div>
              <div className="text-2xl text-green-500">🎬</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Publik</p>
                <p className="text-2xl font-bold text-gray-800">{stats.public}</p>
              </div>
              <div className="text-2xl text-purple-500">🌍</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Owner Only</p>
                <p className="text-2xl font-bold text-gray-800">{stats.owner}</p>
              </div>
              <div className="text-2xl text-orange-500">🔒</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs - Clean Style */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
          {[
            { id: 'all', label: 'Semua', icon: '🖼️' },
            { id: 'photos', label: 'Foto', icon: '📸' },
            { id: 'videos', label: 'Video', icon: '🎬' },
            { id: 'public', label: 'Publik', icon: '🌍' },
            { id: 'owner', label: 'Owner', icon: '🔒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {getFilteredMedia().length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="text-gray-600 font-medium">Belum ada media</h3>
            <p className="text-gray-400 text-sm mt-1">Klik tombol + untuk upload foto atau video</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {getFilteredMedia().map((item) => (
              item.type === 'video' ? (
                <VideoCard key={item._id || item.id} video={item} onDelete={loadMedia} />
              ) : (
                <ImageCard key={item._id || item.id} image={item} onDelete={loadMedia} />
              )
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:bg-blue-600 transition-all z-50"
      >
        +
      </button>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
