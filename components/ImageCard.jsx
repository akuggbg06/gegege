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
      if (onDelete) onDelete();
      setDeleting(false);
    }
  };

  const date = image.uploaded_at ? new Date(image.uploaded_at).toLocaleDateString('id-ID') : 'Baru';
  const visibilityIcon = image.visibility === 'public' ? '🌍' : '🔒';
  const visibilityText = image.visibility === 'public' ? 'Publik' : 'Owner Only';

  return (
    <div className="media-card" style={{ background: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 12px 22px -8px rgba(0,0,0,0.08)', border: '1px solid #e2efff', cursor: 'pointer', position: 'relative' }}>
      <div className="media-preview" style={{ aspectRatio: '1/1', background: '#f2f6fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!imgError ? (
          <img 
            src={image.media_url || image.image_url} 
            alt={image.description || 'Foto'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 40 }}>📸</div>
            <p style={{ fontSize: 12, color: '#999' }}>Gagal load</p>
          </div>
        )}
      </div>
      <div className="privacy-badge" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 30, fontSize: '0.7rem', fontWeight: 500, color: 'white' }}>
        {visibilityIcon} {visibilityText}
      </div>
      <div className="media-info" style={{ padding: '0.8rem' }}>
        <div className="media-name" style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {image.description || (image.file_name || 'Foto')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>📅 {date}</span>
        </div>
        <button 
          onClick={handleDelete} 
          disabled={deleting}
          style={{ width: '100%', marginTop: 8, padding: '6px', background: '#fee2e2', border: 'none', borderRadius: 20, color: '#ef4444', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 500 }}
        >
          {deleting ? 'Menghapus...' : '🗑️ Hapus'}
        </button>
      </div>
    </div>
  );
}
