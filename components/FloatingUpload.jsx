'use client';

import { useRef, useState } from 'react';

export default function FloatingUpload({ onUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Hanya file gambar, Bos!');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Max 10MB, Bos!');
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
        className="floating-btn disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          '+'
        )}
      </button>
    </div>
  );
}
