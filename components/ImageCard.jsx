'use client';

import { useState } from 'react';

export default function ImageCard({ image, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async () => {
    if (confirm('Yakin mau hapus foto ini, Bos?')) {
      setDeleting(true);
      await onDelete(image._id || image.id);
    }
  };

  const date = image.uploadedAt 
    ? new Date(parseInt(image.uploadedAt)).toLocaleDateString('id-ID')
    : new Date(image.uploaded_at).toLocaleDateString('id-ID');

  return (
    <div className="glass-card overflow-hidden group animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={image.image_url || image.imageUrl}
          alt={image.image_name || image.imageName || 'Foto'}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x400/1a1a2e/8b5cf6?text=GAGAL+LOAD';
            setImageLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-300 truncate font-medium">
          {image.image_name || image.imageName || 'Untitled'}
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            📅 {date}
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition disabled:opacity-50 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {deleting ? '...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
