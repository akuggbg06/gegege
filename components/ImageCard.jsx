'use client';

import { useState } from 'react';

export default function ImageCard({ image, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Yakin mau hapus foto ini, kontol?')) {
      setDeleting(true);
      await onDelete(image.id);
    }
  };

  const date = new Date(parseInt(image.uploadedAt)).toLocaleDateString('id-ID');

  return (
    <div className="image-card bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      <div className="relative group">
        <img
          src={image.imageUrl}
          alt={image.imageName || 'Foto'}
          className="w-full h-56 object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=GAGAL+LOAD' }}
        />
      </div>
      
      <div className="p-3">
        <p className="text-xs text-gray-400 truncate">{image.imageName || 'Untitled'}</p>
        <p className="text-xs text-gray-500 mt-1">📅 {date}</p>
        
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full mt-3 bg-red-600/20 hover:bg-red-600/40 text-red-400 py-1.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {deleting ? 'Menghapus...' : '🗑️ Hapus'}
        </button>
      </div>
    </div>
  );
}
