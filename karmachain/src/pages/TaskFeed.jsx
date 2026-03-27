import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskCard } from '../components/ui/TaskCard';
import { Search, ChevronDown, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getTasks } from '../api/taskService';
import { useAuth } from '../context/AuthContext';

export const TaskFeed = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Recommended');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['Recommended', 'High Reward', 'Urgent', 'Easy Tasks'];

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      // Only show open tasks
      setTasks(data.filter(t => t.status === 'open'));
    } catch (err) {
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAccept = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleViewDetails = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  // Filter by search
  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format tasks for TaskCard component
  const formatTask = (task) => ({
    id: task._id,
    title: task.title,
    description: task.description,
    reward: task.reward?.toString() || '0',
    minTrustScore: task.minTrustScore || 0,
    author: task.owner?.name || 'Anonymous',
    timeAgo: formatTimeAgo(task.createdAt),
    priority: task.reward > 80 ? 'high' : task.reward > 40 ? 'medium' : 'low',
    tags: buildTags(task),
    status: task.status,
  });

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const buildTags = (task) => {
    const tags = [];
    if (task.reward >= 80) tags.push('High Reward');
    if (task.minTrustScore >= 80) tags.push('Trusted Only');
    if (task.minTrustScore === 0) tags.push('Easy');
    return tags;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* AI Suggested Banner */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 via-blue-50 to-white rounded-xl border border-indigo-100 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 shadow-sm border border-indigo-200">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">AI Suggested for You</h2>
            <p className="text-sm text-gray-600 font-medium">
              Welcome back, <span className="text-indigo-700">{currentUser?.name}</span>! Your trust score is{' '}
              <span className="font-bold text-indigo-700">{currentUser?.trustScore}</span>.
            </p>
          </div>
        </div>
        <button
          onClick={fetchTasks}
          className="text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Available Tasks</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Find ways to help and earn KarmaCoins.</p>
        </div>

        <div className="flex space-x-3 items-center">
          <div className="relative flex-grow md:flex-grow-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 pr-4 sm:text-sm border-gray-200 rounded-lg py-2.5 border bg-white shadow-sm transition-shadow hover:shadow-md"
              placeholder="Search tasks..."
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-between w-40 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <span className="truncate">{activeFilter}</span>
              <ChevronDown className={`w-4 h-4 ml-2 text-gray-500 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1 overflow-hidden">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors ${activeFilter === filter ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    onClick={() => { setActiveFilter(filter); setFilterOpen(false); }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm font-medium">Loading tasks...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 rounded-xl p-5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Could not fetch tasks</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={fetchTasks} className="ml-auto text-sm underline font-medium">Retry</button>
        </div>
      )}

      {!loading && !error && filteredTasks.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-semibold mb-1">No tasks available</p>
          <p className="text-sm">Check back later or create a new task!</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={formatTask(task)}
              onAccept={handleAccept}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
