'use client';

import { useState, useEffect } from 'react';

export default function BroadcastBanner() {
  const [broadcast, setBroadcast] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch('/api/admin/broadcast')
      .then(res => res.json())
      .then(data => {
        if (data.active && data.message) {
          setBroadcast(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!broadcast || !visible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 bg-yellow-600/90 backdrop-blur-sm z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📢</span>
          <p className="text-sm font-medium">{broadcast.message}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-yellow-500/30 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
