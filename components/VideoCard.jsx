'use client';

import { useState } from 'react';

export default function VideoCard({ video, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Yakin hapus video ini?')) {
      setDeleting(true);
      const token = localStorage.getItem('token');
      await fetch(`/api/media/${video._id || video.id}?type=video`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onDelete();
    }
  };

  const date = new Date(video.uploaded_at).toLocaleDateString('id-ID');
  const visibilityIcon = video.visibility === 'public' ? '🌍' : '🔒';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="aspect-video bg-gray-100">
        <video src={video.media_url} className="w-full h-full object-cover" controls />
      </div>
      <div className="p-2">
        {video.description && (
          <p className="text-xs text-gray-500 truncate">{video.description}</p>
        )}
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400">📅 {date}</span>
          <span className="text-xs">{visibilityIcon}</span>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full mt-2 text-xs text-red-500 hover:text-red-600 text-center py-1"
        >
          {deleting ? '...' : '🗑️ Hapus'}
        </button>
      </div>
    </div>
  );
}
