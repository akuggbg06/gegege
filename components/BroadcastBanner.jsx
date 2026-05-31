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
    <div className="fixed top-20 left-4 right-4 z-40 animate-fade-in">
      <div className="glass bg-gradient-to-r from-purple-600/90 to-pink-600/90 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📢</span>
          <p className="text-sm font-medium">{broadcast.message}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
