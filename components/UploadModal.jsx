'use client';

import { useState, useRef } from 'react';

export default function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    const isVideo = selectedFile.type.startsWith('video/');
    const isImage = selectedFile.type.startsWith('image/');
    if (!isVideo && !isImage) {
      alert('Hanya file gambar atau video!');
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('Maksimal 50MB!');
      return;
    }
    setFile(selectedFile);
    setFileType(isVideo ? 'video' : 'image');
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Pilih file dulu!');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('visibility', visibility);
    formData.append('type', fileType);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('Upload berhasil!');
        if (onUploadComplete) onUploadComplete();
        onClose();
        resetForm();
      } else {
        alert('Upload gagal!');
      }
    } catch (err) {
      alert('Terjadi kesalahan!');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setDescription('');
    setVisibility('public');
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', width: '90%', maxWidth: 480, borderRadius: '2rem', padding: '1.6rem', borderTop: '6px solid #2563eb' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '1rem' }}>Upload Media</h3>
        {!file ? (
          <div style={{ border: '2px dashed #cbd5e1', borderRadius: '1rem', padding: '2rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📤</div>
            <p>Klik untuk pilih file</p>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1rem' }}>
              {fileType === 'image' ? (
                <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '1rem' }} />
              ) : (
                <video src={preview} controls style={{ width: '100%', borderRadius: '1rem' }} />
              )}
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>{file.name}</p>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Deskripsi (opsional)</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '1.2rem', border: '1px solid #cbd5e1' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Privacy</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label><input type="radio" name="privacy" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} /> 🌍 Publik</label>
                <label><input type="radio" name="privacy" value="owner" checked={visibility === 'owner'} onChange={() => setVisibility('owner')} /> 🔒 Owner Only</label>
              </div>
            </div>
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={onClose} style={{ padding: '0.6rem 1.4rem', borderRadius: '2rem', border: 'none', background: '#e4e7f0', cursor: 'pointer' }}>Batal</button>
          <button onClick={handleUpload} disabled={!file || uploading} style={{ padding: '0.6rem 1.4rem', borderRadius: '2rem', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}>{uploading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </div>
    </div>
  );
}
