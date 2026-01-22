'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    username: string;
    currency: string;
  };
}

export default function Layout({ children, user }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Transactions', href: '/transactions', icon: '💳', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Categories', href: '/categories', icon: '🏷️', gradient: 'from-orange-500 to-red-500' },
    { name: 'Budgets', href: '/budgets', icon: '💰', gradient: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Modern Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 flex flex-col relative shadow-2xl`}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
        
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-700/50 relative z-10">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">💵</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FinTrack
                </span>
                <p className="text-xs text-gray-400">Financial Manager</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors relative z-10"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-white/10 shadow-lg'
                    : 'hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10`} />
                )}
                <div className={`text-2xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {item.name}
                  </span>
                )}
                {isActive && isSidebarOpen && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700/50 relative z-10">
          {isSidebarOpen ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">{user?.currency || 'USD'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-3 text-white hover:bg-red-500/20 rounded-lg transition-colors"
              title="Logout"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}