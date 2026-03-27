import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, User, Menu, X, LogOut, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyTasksWithProofs } from '../../api/proofService';

const getTrustLabel = (score) => {
  if (score >= 90) return 'Core Contributor';
  if (score >= 60) return 'Trusted Member';
  return 'Beginner';
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const navLinks = [
    { name: 'Feed',     path: '/',         icon: Home },
    { name: 'Create',   path: '/create',   icon: PlusSquare },
    { name: 'My Tasks', path: '/my-tasks', icon: ClipboardList },
    { name: 'Profile',  path: '/profile',  icon: User },
  ];

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!currentUser?._id) return;
    getMyTasksWithProofs(currentUser._id)
      .then(tasks => {
        const count = tasks.reduce(
          (sum, t) => sum + (t.proofs?.filter(p => p.status === 'pending').length || 0), 0
        );
        setPendingCount(count);
      })
      .catch(() => {});
  }, [currentUser?._id]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const initial = currentUser?.name?.charAt(0)?.toUpperCase() || 'U';
  const coins = currentUser?.coins ?? 0;
  const trustScore = currentUser?.trustScore ?? 50;
  const trustLabel = getTrustLabel(trustScore);

  return (
    <nav className="bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">

          {/* ── Logo — far left ── */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">K</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">KarmaCoin</span>
          </Link>

          {/* ── Desktop Nav + Right controls — all right-aligned ── */}
          <div className="hidden md:flex items-center ml-auto space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const showBadge = link.path === '/my-tasks' && pendingCount > 0;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive(link.path)
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.name}</span>
                  {showBadge && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right side: coins + avatar + logout ── */}
          <div className="hidden md:flex items-center space-x-3 shrink-0 pl-4 border-l border-gray-200">
            <div className="text-right flex flex-col justify-center">
              <div className="text-sm font-bold text-gray-900 leading-tight">
                {coins} <span className="text-xs text-gray-500 font-medium">KC</span>
              </div>
              <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md mt-0.5 border border-blue-100">
                {trustLabel}
              </div>
            </div>

            <Link to="/profile">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-white shadow-md shadow-blue-500/20 transform transition-transform hover:scale-105 cursor-pointer">
                <span className="text-white font-bold text-sm leading-none">{initial}</span>
              </div>
            </Link>

            {/* Logout — always red */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* ── Mobile menu button ── */}
          <div className="flex items-center md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-50"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive(link.path) ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="mt-4 px-3 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold leading-none">{initial}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{currentUser?.name || 'User'}</div>
                    <div className="flex space-x-2 text-sm mt-0.5">
                      <span className="font-semibold text-gray-900">{coins} <span className="text-gray-500 font-normal">KC</span></span>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600 font-medium">{trustScore} Trust</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
