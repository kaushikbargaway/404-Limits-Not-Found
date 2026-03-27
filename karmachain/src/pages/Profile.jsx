import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { ShieldCheck, FileCheck, Coins, TrendingUp, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { getTasks } from '../api/taskService';
import { getUserTransactions } from '../api/rewardService';
import { getUserById } from '../api/userService';
import { useAuth } from '../context/AuthContext';

const getTrustLevel = (score) => {
  if (score >= 90) return 'Core Contributor';
  if (score >= 60) return 'Trusted Member';
  return 'Beginner';
};

const getNextLevel = (score) => {
  if (score < 60) return { label: 'Trusted Member', needed: 60 - score };
  if (score < 90) return { label: 'Core Contributor', needed: 90 - score };
  return { label: 'Max Level', needed: 0 };
};

export const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUser } = useAuth();

  const [completedTasks, setCompletedTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Re-fetch latest user data to get up-to-date coins & trustScore
        const [freshUser, allTasks, txns] = await Promise.all([
          getUserById(currentUser._id),
          getTasks(),
          getUserTransactions(currentUser._id).catch(() => []),
        ]);

        // Sync AuthContext + localStorage with the fresh values
        updateUser(freshUser);

        const mine = allTasks.filter(
          t => (t.assignedTo?._id === freshUser._id || t.assignedTo === freshUser._id)
        );
        setCompletedTasks(mine);
        setTransactions(txns);
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser._id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const trustLevel = getTrustLevel(currentUser.trustScore);
  const nextLevel = getNextLevel(currentUser.trustScore);

  // Calculate earned KC from transactions
  const totalEarned = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ── User Card ── */}
        <div className="md:col-span-1">
          <Card className="h-full border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30 mb-5 border-4 border-white">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{currentUser.name}</h2>
              <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full mb-6 font-mono shadow-sm">
                {currentUser._id?.slice(0, 12)}...
              </div>

              <div className="w-full pt-6 border-t border-gray-100">
                <div className="flex flex-col mb-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-900">{trustLevel}</span>
                    <span className="text-xs font-semibold text-blue-600">{currentUser.trustScore} / 100</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${currentUser.trustScore}%` }}
                    />
                  </div>
                  {nextLevel.needed > 0 && (
                    <p className="text-[10px] text-gray-400 mt-2 text-left font-medium">
                      {nextLevel.needed} points to {nextLevel.label}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Stats ── */}
        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-gray-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center mb-4 text-amber-500 border border-amber-100 shadow-sm">
                <Coins className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Balance</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                {currentUser.coins} <span className="text-lg text-gray-400 font-medium">KC</span>
              </h3>
              {totalEarned > 0 && (
                <p className="text-xs text-emerald-600 mt-3 font-semibold flex items-center bg-emerald-50 w-max px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{totalEarned} KC earned
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-gray-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mb-4 text-emerald-600 border border-emerald-100 shadow-sm">
                <FileCheck className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Tasks Accepted</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{completedTasks.length}</h3>
              <p className="text-xs text-blue-600 mt-3 font-semibold flex items-center bg-blue-50 w-max px-2 py-1 rounded-md">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Trust Score: {currentUser.trustScore}
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
                <p className="text-gray-300 text-sm max-w-sm mb-4">
                  {nextLevel.needed > 0
                    ? `Complete more tasks to earn ${nextLevel.needed} more points and reach ${nextLevel.label}.`
                    : "You've reached the maximum trust level. Keep leading the community!"}
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Browse Tasks
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Your Accepted Tasks</h3>

        {loading && (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Loading activity...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && completedTasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="font-semibold mb-1">No accepted tasks yet</p>
            <p className="text-sm">Head to the feed and accept a task to get started!</p>
          </div>
        )}

        {!loading && !error && completedTasks.length > 0 && (
          <div className="grid gap-4">
            {completedTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => navigate(`/tasks/${task._id}`)}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-amber-600">{task.reward} KC</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
