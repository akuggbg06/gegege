'use client';

import { useState, useRef } from 'react';

export default function VideoCard({ video, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);

  const handleDelete = async () => {
    if (confirm('Yakin hapus video ini?')) {
      setDeleting(true);
      const token = localStorage.getItem('token');
      await fetch(`/api/media/${video._id || video.id}?type=video`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (onDelete) onDelete();
      setDeleting(false);
    }
  };

  const date = video.uploaded_at ? new Date(video.uploaded_at).toLocaleDateString('id-ID') : 'Baru';
  const visibilityIcon = video.visibility === 'public' ? '🌍' : '🔒';
  const visibilityText = video.visibility === 'public' ? 'Publik' : 'Owner Only';

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) videoRef.current.play();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="media-card" 
      style={{ background: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 12px 22px -8px rgba(0,0,0,0.08)', border: '1px solid #e2efff', cursor: 'pointer', position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="media-preview" style={{ aspectRatio: '1/1', background: '#f2f6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <video 
          ref={videoRef}
          src={video.media_url || video.video_url} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          loop
          playsInline
        />
        {!isHovering && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 48, color: 'white', textShadow: '0 0 10px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
            ▶️
          </div>
        )}
      </div>
      <div className="privacy-badge" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 30, fontSize: '0.7rem', fontWeight: 500, color: 'white' }}>
        {visibilityIcon} {visibilityText}
      </div>
      <div className="media-info" style={{ padding: '0.8rem' }}>
        <div className="media-name" style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {video.description || (video.file_name || 'Video')}
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
