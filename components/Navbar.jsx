'use client';

import { useRouter } from 'next/navigation';

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">I</div>
          <span className="font-bold text-xl">Inorya Storage</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">👤 {user?.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600/30 px-4 py-1 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
