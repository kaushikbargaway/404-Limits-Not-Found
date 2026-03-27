import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login, loading, error, currentUser } = useAuth();

  // Already logged in
  if (currentUser) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await login(name.trim());
      navigate('/');
    } catch {
      // error is already in context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-4xl">K</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome to KarmaChain
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Earn trust and rewards by completing tasks in your community.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Username / Pseudo-Identity
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border bg-gray-50 placeholder-gray-400"
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                First time? We'll create an account for you automatically.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full py-3 text-base flex justify-center items-center group"
                disabled={loading || !name.trim()}
              >
                {loading ? 'Connecting...' : 'Connect & Enter'}
                {!loading && (
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure & Anonymous</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
