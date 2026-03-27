import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { ShieldCheck, FileCheck, Coins, TrendingUp } from 'lucide-react';
import { TaskCard } from '../components/ui/TaskCard';

export const Profile = () => {
  const user = {
    username: 'JohnDoeEth',
    address: '0x71C...9B8e',
    trustScore: 82,
    maxTrust: 100,
    trustLevel: 'Trusted Member', // Beginner, Trusted Member, Core Contributor
    balance: 450,
    tasksCompleted: 12,
    memberSince: 'Oct 2025'
  };

  const history = [
    {
      id: 11,
      title: 'Fix the broken bench at the bus stop',
      description: 'The wooden bench at the main street bus stop needs minor repairs and a fresh coat of paint.',
      reward: '120',
      timeAgo: 'Completed 2 days ago',
      minTrustScore: 80,
      author: 'CityCouncil',
      priority: 'low',
      tags: ['Community', 'Manual Labor'],
    },
    {
      id: 12,
      title: 'Deliver groceries to elderly neighbor',
      description: 'Mrs. Smith needs her weekly groceries delivered. The list and payment are pre-arranged at the local store.',
      reward: '30',
      timeAgo: 'Completed 1 week ago',
      minTrustScore: 50,
      author: 'NeighborhoodWatch',
      priority: 'medium',
      tags: ['Delivery', 'High Impact'],
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Dashboard</h1>
        <span className="text-sm font-medium text-gray-500">Member since {user.memberSince}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card className="h-full border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30 mb-5 border-4 border-white">
                {user.username.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{user.username}</h2>
              <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full mb-6 font-mono shadow-sm">
                {user.address}
              </div>
              
              <div className="w-full pt-6 border-t border-gray-100">
                <div className="flex flex-col mb-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-900">{user.trustLevel}</span>
                    <span className="text-xs font-semibold text-blue-600">{user.trustScore} / {user.maxTrust}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(user.trustScore / user.maxTrust) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-left font-medium">18 points to Core Contributor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-gray-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center mb-4 text-amber-500 border border-amber-100 shadow-sm">
                <Coins className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Available Balance</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{user.balance} <span className="text-lg text-gray-400 font-medium">KC</span></h3>
              <p className="text-xs text-emerald-600 mt-3 font-semibold flex items-center bg-emerald-50 w-max px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" />
                +150 KC this week
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-gray-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mb-4 text-emerald-600 border border-emerald-100 shadow-sm">
                <FileCheck className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Tasks Completed</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{user.tasksCompleted}</h3>
              <p className="text-xs text-blue-600 mt-3 font-semibold flex items-center bg-blue-50 w-max px-2 py-1 rounded-md">
                <ShieldCheck className="w-3 h-3 mr-1" />
                100% Success Rate
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-2 bg-gradient-to-r from-gray-900 to-slate-800 text-white border-none shadow-lg">
            <CardContent className="p-6 flex items-center justify-between mb-0 pb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <ShieldCheck className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Boost Your Trust Score</h3>
                <p className="text-gray-300 text-sm max-w-sm mb-4">Complete 3 more High Priority tasks this month to reach Core Contributor status and unlock premium rewards.</p>
                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                  View Eligible Tasks
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Recent Activity</h3>
        <div className="grid gap-5">
          {history.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};
