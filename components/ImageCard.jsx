'use client';

import { useState } from 'react';

export default function ImageCard({ image, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Yakin mau hapus foto ini, Bos?`)) {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/media/${image._id || image.id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onDelete();
      }
      setDeleting(false);
    }
  };

  const date = new Date(image.uploaded_at).toLocaleDateString('id-ID');
  const visibilityIcon = image.visibility === 'public' ? '🌍' : '🔒';
  const visibilityText = image.visibility === 'public' ? 'Public' : 'Owner Only';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 hover:scale-105 transition-all duration-300 group">
      <div className="relative aspect-square bg-gray-900 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={image.image_url}
          alt={image.description || 'Foto'}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x400/1a1a2e/8b5cf6?text=GAGAL+LOAD';
            setImageLoaded(true);
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="px-2 py-1 bg-black/70 rounded-lg text-xs flex items-center gap-1">
            {visibilityIcon} {visibilityText}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        {image.description && (
          <p className="text-sm text-gray-300 mb-2 line-clamp-2">{image.description}</p>
        )}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>📸 Foto</span>
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
