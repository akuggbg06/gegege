'use client';

import { useState } from 'react';

export default function VideoCard({ video, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Yakin mau hapus video ini, Bos?`)) {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/media/${video._id || video.id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onDelete();
      }
      setDeleting(false);
    }
  };

  const date = new Date(video.uploaded_at).toLocaleDateString('id-ID');
  const visibilityIcon = video.visibility === 'public' ? '🌍' : '🔒';
  const visibilityText = video.visibility === 'public' ? 'Public' : 'Owner Only';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
      <div className="relative aspect-video bg-gray-900">
        <video src={video.video_url} className="w-full h-full object-cover" controls />
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="px-2 py-1 bg-black/70 rounded-lg text-xs flex items-center gap-1">
            {visibilityIcon} {visibilityText}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        {video.description && (
          <p className="text-sm text-gray-300 mb-2 line-clamp-2">{video.description}</p>
        )}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>🎬 Video</span>
            <span>📅 {date}</span>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition flex items-center gap-1"
          >
            🗑️ {deleting ? '...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
