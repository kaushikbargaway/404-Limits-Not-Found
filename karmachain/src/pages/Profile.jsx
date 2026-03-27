import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { ShieldCheck, Award, FileCheck, Coins } from 'lucide-react';
import { TaskCard } from '../components/ui/TaskCard';

export const Profile = () => {
  const user = {
    username: 'JohnDoeEth',
    address: '0x71C...9B8e',
    trustScore: 98,
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
    },
    {
      id: 12,
      title: 'Deliver groceries to elderly neighbor',
      description: 'Mrs. Smith needs her weekly groceries delivered. The list and payment are pre-arranged at the local store.',
      reward: '30',
      timeAgo: 'Completed 1 week ago',
      minTrustScore: 50,
      author: 'NeighborhoodWatch',
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                {user.username.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.username}</h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-6 font-mono">
                {user.address}
              </div>
              
              <div className="w-full pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 text-sm">Member Since</span>
                  <span className="text-gray-900 font-medium text-sm">{user.memberSince}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Trust Score</p>
              <h3 className="text-3xl font-bold text-gray-900">{user.trustScore}</h3>
              <p className="text-xs text-blue-600 mt-2 font-medium">Top 5% Contributor</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 text-amber-500">
                <Coins className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Available Balance</p>
              <h3 className="text-3xl font-bold text-gray-900">{user.balance} <span className="text-lg text-gray-500 font-normal">KC</span></h3>
              <p className="text-xs text-emerald-600 mt-2 font-medium">+150 KC this week</p>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-6 flex items-center mb-0 pb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mr-4 text-emerald-600 flex-shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Tasks Completed</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-2xl font-bold text-gray-900">{user.tasksCompleted}</h3>
                  <span className="text-sm text-gray-500">Total lifetime tasks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Recent Activity</h3>
        <div className="grid gap-6">
          {history.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};
