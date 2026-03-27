import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskCard } from '../components/ui/TaskCard';
import { Search, ChevronDown, Sparkles } from 'lucide-react';

const DUMMY_TASKS = [
  {
    id: 1,
    title: 'Clean up the local park',
    description: 'We need volunteers to help clean up the Central Park this weekend. Bags and gloves will be provided. Please upload a before/after picture as proof.',
    reward: '50',
    timeAgo: '2h ago',
    minTrustScore: 20,
    author: 'CommunityBoard',
    priority: 'low',
    aiMatch: 82,
    tags: ['Easy', 'Community'],
  },
  {
    id: 2,
    title: 'Deliver groceries to elderly neighbor',
    description: 'Mrs. Smith needs her weekly groceries delivered. The list and payment are pre-arranged at the local store.',
    reward: '30',
    timeAgo: '5h ago',
    minTrustScore: 50,
    author: 'NeighborhoodWatch',
    priority: 'high',
    aiMatch: 95,
    tags: ['Urgent', 'High Impact'],
    rewardBonus: true,
  },
  {
    id: 3,
    title: 'Fix the broken bench at the bus stop',
    description: 'The wooden bench at the main street bus stop needs minor repairs and a fresh coat of paint. Materials cost will be reimbursed separately.',
    reward: '120',
    timeAgo: '1d ago',
    minTrustScore: 80,
    author: 'CityCouncil',
    priority: 'medium',
    aiMatch: 70,
    tags: ['Medium Effort'],
  }
];

export const TaskFeed = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Recommended');

  const filters = ['Recommended', 'High Reward', 'Urgent', 'Easy Tasks'];

  const handleAccept = (taskId) => {
    // API Call placeholder
  };

  const handleViewDetails = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Suggested Section Banner */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 via-blue-50 to-white rounded-xl border border-indigo-100 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 shadow-sm border border-indigo-200">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">AI Suggested for You</h2>
            <p className="text-sm text-gray-600 font-medium">Based on your successful tasks and current trust score.</p>
          </div>
        </div>
        <button className="text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors shadow-sm">
          Review Matches
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
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 pr-4 sm:text-sm border-gray-200 rounded-lg py-2.5 border bg-white shadow-sm transition-shadow hover:shadow-md"
              placeholder="Search tasks..."
            />
          </div>

          {/* Smart Filter Dropdown */}
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
                    className={`block w-full text-left px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                      activeFilter === filter ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setActiveFilter(filter);
                      setFilterOpen(false);
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        {DUMMY_TASKS.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onAccept={handleAccept} 
            onViewDetails={handleViewDetails} 
          />
        ))}
      </div>
    </div>
  );
};
