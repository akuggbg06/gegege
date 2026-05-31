'use client';

import { useState } from 'react';

export default function ImageCard({ image, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDelete = async () => {
    if (confirm('Yakin hapus foto ini?')) {
      setDeleting(true);
      const token = localStorage.getItem('token');
      await fetch(`/api/media/${image._id || image.id}?type=image`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onDelete();
    }
  };

  const date = new Date(image.uploaded_at).toLocaleDateString('id-ID');
  const visibilityIcon = image.visibility === 'public' ? '🌍' : '🔒';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {!imgError ? (
          <img
            src={image.media_url}
            alt={image.description || 'Foto'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-1">🖼️</div>
              <p className="text-xs">Gagal load</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-2">
        {image.description && (
          <p className="text-xs text-gray-500 truncate">{image.description}</p>
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
