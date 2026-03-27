import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Feed', path: '/', icon: Home },
    { name: 'Create', path: '/create', icon: PlusSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 block">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center block">
                <span className="text-white font-bold text-xl leading-none">K</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">KarmaCoin</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${isActive(link.path)
                      ? 'text-blue-600 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
            <div className="pl-6 border-l border-gray-200 flex items-center space-x-4">
              <div className="text-right flex flex-col justify-center">
                <div className="text-sm font-bold text-gray-900 leading-tight">450 <span className="text-xs text-gray-500 font-medium">KC</span></div>
                <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md mt-0.5 border border-blue-100">
                  Trusted Member
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-white shadow-md shadow-blue-500/20 block transform transition-transform hover:scale-105 cursor-pointer">
                <span className="text-white font-bold text-sm leading-none">U</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
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
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors ${isActive(link.path)
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
                <div className="flex items-center space-x-3 block">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm block">
                    <span className="text-white font-bold block leading-none">U</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">User Setup</div>
                    <div className="flex space-x-2 text-sm mt-0.5">
                      <span className="font-semibold text-gray-900 drop-shadow-sm">450 <span className="text-gray-500 font-normal">KC</span></span>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600 font-medium">98 Trust</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
