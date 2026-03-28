import React, { useState, useEffect } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { getUsers } from '../../api/userService';

export const TopContributorBadge = () => {
  const [topUser, setTopUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUser = async () => {
      try {
        const users = await getUsers();
        if (users && users.length > 0) {
          // Sort by coins descending to find the "Top Legend"
          const leader = [...users].sort((a, b) => (b.coins || 0) - (a.coins || 0))[0];
          setTopUser(leader);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUser();
    // Refresh every 30 seconds for that "live" competitive feel
    const interval = setInterval(fetchTopUser, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !topUser) return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] group hidden lg:block">
      <div className="relative">
        {/* Pulsing Golden Aura */}
        <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-700" />
        
        {/* Main Banner Circle */}
        <div className="relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-md border-2 border-amber-400 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.5)] flex flex-col items-center justify-center cursor-help transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
          {/* Floating Crown Icon */}
          <Crown className="w-5 h-5 text-amber-500 absolute -top-3 drop-shadow-md animate-bounce [animation-duration:3s]" style={{ fill: 'currentColor' }} />
          
          <div className="text-[10px] font-black text-amber-600 uppercase tracking-tighter mb-0.5 mt-1">King</div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-xs shadow-inner transform group-hover:scale-110 transition-transform">
            {topUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-[11px] font-black text-gray-900 mt-1 leading-none tracking-tight">
            {topUser.coins}<span className="text-[8px] text-amber-600 ml-0.5">KC</span>
          </div>
        </div>

        {/* Glossy Overlay Reflection */}
        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-br from-white/40 to-transparent opacity-50" />

        {/* Hover Hover Info Panel */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-52 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 opacity-0 scale-90 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 origin-right">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                <Trophy className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] text-amber-600 font-bold uppercase tracking-[0.1em] mb-0.5">Top Legend</p>
               <p className="text-base font-black text-gray-900 truncate max-w-[100px]">{topUser.name}</p>
             </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
              <div className="flex justify-between text-[11px] items-center">
                <span className="text-gray-500 font-bold">Balance</span>
                <span className="font-black text-gray-900 text-sm">{topUser.coins} <span className="text-[10px] text-amber-600 font-bold">KC</span></span>
              </div>
            </div>
            
            <div className="bg-blue-50/50 rounded-xl p-2.5 border border-blue-50">
              <div className="flex justify-between text-[11px] items-center">
                <span className="text-blue-600 font-bold">Trust Score</span>
                <span className="font-black text-blue-700 text-sm">{topUser.trustScore}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Beat them to take the throne</p>
          </div>

          {/* Tooltip Arrow */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-white" />
        </div>
      </div>
    </div>
  );
};
