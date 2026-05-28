'use client';

import { useRef, useState } from 'react';

export default function FloatingUpload({ onUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Hanya file gambar, kontol!');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Max 10MB, goblok!');
      return;
    }
    
    setUploading(true);
    await onUpload(file);
    setUploading(false);
    fileInputRef.current.value = '';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={uploading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="floating-btn w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold transition-all hover:scale-110 disabled:opacity-50"
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
        ) : (
          '+'
        )}
      </button>
    </div>
  );
}
