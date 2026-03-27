import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskCard } from '../components/ui/TaskCard';
import { Search, Filter } from 'lucide-react';

const DUMMY_TASKS = [
  {
    id: 1,
    title: 'Clean up the local park',
    description: 'We need volunteers to help clean up the Central Park this weekend. Bags and gloves will be provided. Please upload a before/after picture as proof.',
    reward: '50',
    timeAgo: '2h ago',
    minTrustScore: 20,
    author: 'CommunityBoard',
  },
  {
    id: 2,
    title: 'Deliver groceries to elderly neighbor',
    description: 'Mrs. Smith needs her weekly groceries delivered. The list and payment are pre-arranged at the local store.',
    reward: '30',
    timeAgo: '5h ago',
    minTrustScore: 50,
    author: 'NeighborhoodWatch',
  },
  {
    id: 3,
    title: 'Fix the broken bench at the bus stop',
    description: 'The wooden bench at the main street bus stop needs minor repairs and a fresh coat of paint. Materials cost will be reimbursed separately.',
    reward: '120',
    timeAgo: '1d ago',
    minTrustScore: 80,
    author: 'CityCouncil',
  }
];

export const TaskFeed = () => {
  const navigate = useNavigate();

  const handleAccept = (taskId) => {
    console.log('Accepted task:', taskId);
    // API Call placeholder
  };

  const handleViewDetails = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Available Tasks</h1>
          <p className="text-gray-500 mt-1">Find ways to help and earn KarmaCoins.</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative flex-grow md:flex-grow-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2 border bg-white"
              placeholder="Search tasks..."
            />
          </div>
          <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-6">
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
