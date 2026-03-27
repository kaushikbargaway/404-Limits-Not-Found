import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [wallet, setWallet] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (wallet.trim()) {
      // Simulate login
      navigate('/');
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
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
                Wallet Address / Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="wallet"
                  name="wallet"
                  type="text"
                  required
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border bg-gray-50 placeholder-gray-400"
                  placeholder="Enter your pseudo-identity"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full py-3 text-base flex justify-center items-center group">
                Connect & Enter
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
