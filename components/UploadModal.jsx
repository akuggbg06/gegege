'use client';

import { useState, useRef } from 'react';

export default function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    const isVideo = selectedFile.type.startsWith('video/');
    const isImage = selectedFile.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      alert('Hanya file gambar atau video yang didukung, Bos!');
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('Ukuran file maksimal 50MB, Bos!');
      return;
    }
    
    setFile(selectedFile);
    setFileType(isVideo ? 'video' : 'image');
    
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Pilih file dulu, Bos!');
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
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (res.ok) {
        alert('Upload berhasil, Bos! 🎉');
        onUploadComplete();
        onClose();
        resetForm();
      } else {
        const error = await res.json();
        alert('Upload gagal: ' + error.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan, coba lagi Bos!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Upload Media</h2>
          <p className="text-purple-200 text-sm">Upload foto atau video ke gallery</p>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {/* Drop Zone */}
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-3">📤</div>
              <p className="text-gray-300 mb-2">Drag & drop file di sini</p>
              <p className="text-gray-500 text-sm">atau klik untuk browse</p>
              <p className="text-gray-600 text-xs mt-3">Support: JPG, PNG, GIF, MP4, WebM (Max 50MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                  {fileType === 'image' ? (
                    <img src={preview} alt="Preview" className="max-w-full max-h-64 object-contain" />
                  ) : (
                    <video src={preview} controls className="max-w-full max-h-64" />
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-2 truncate">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
              
              {/* Deskripsi (Opsional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Deskripsi <span className="text-gray-500">(Opsional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tulis deskripsi untuk media ini..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  rows="2"
                />
              </div>
              
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Visibilitas <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`p-3 rounded-xl border transition-all ${
                      visibility === 'public'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">🌍</div>
                    <div className="font-medium">Public</div>
                    <div className="text-xs opacity-70">Bisa dilihat semua orang</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('owner')}
                    className={`p-3 rounded-xl border transition-all ${
                      visibility === 'owner'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">🔒</div>
                    <div className="font-medium">Owner Only</div>
                    <div className="text-xs opacity-70">Hanya kamu yang bisa lihat</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Batal
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
