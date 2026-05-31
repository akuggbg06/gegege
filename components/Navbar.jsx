'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({ user }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="glass fixed top-4 left-4 right-4 z-50 px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="font-bold text-xl">Z</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Zexzo Storage
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <span className="text-gray-300">
            👋 Halo, <span className="text-purple-400 font-semibold">{user?.username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full text-red-400 transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
        
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col gap-3">
            <span className="text-gray-300 px-2">
              👋 Halo, {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
