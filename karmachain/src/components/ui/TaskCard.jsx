import React, { useState } from 'react';
import { Button } from './Button';
import { Coins, ShieldCheck, Clock, Zap, Target, Sparkles, Check } from 'lucide-react';

export const TaskCard = ({ task, onAccept, onViewDetails }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAcceptClick = (e) => {
    e.stopPropagation();
    setIsAccepted(true);
    if (onAccept) onAccept(task.id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-100';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'low': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const priorityLabel = task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium';

  return (
    <div 
      className={`relative bg-white rounded-xl border border-gray-100 p-5 transition-all duration-300 ease-out cursor-pointer ${
        isHovered ? 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] -translate-y-0.5 border-blue-100' : 'shadow-sm hover:shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails && onViewDetails(task.id)}
    >
      {/* Top badges row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2">
          {task.aiMatch && (
            <div className="flex items-center text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
              AI Match: {task.aiMatch}%
            </div>
          )}
          
          <div className={`flex items-center text-xs font-medium border px-2.5 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority === 'high' ? <Zap className="w-3 h-3 mr-1" /> : <Target className="w-3 h-3 mr-1" />}
            {priorityLabel}
          </div>

          {task.tags && task.tags.map(tag => (
            <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-end">
          <span className="flex items-center text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full text-sm font-bold shadow-sm group-hover:bg-blue-100 transition-colors">
            <Coins className="w-4 h-4 mr-1 text-blue-500" />
            {task.reward} KC
          </span>
          {task.rewardBonus && (
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">
              ✨ High Reward
            </span>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-5 mt-2 line-clamp-2 leading-relaxed">{task.description}</p>
      
      <div className="flex flex-wrap items-center text-xs text-gray-500 mb-5 gap-4">
        <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
          {task.timeAgo}
        </div>
        <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
          Min Trust: {task.minTrustScore}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <div className="flex items-center group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-white shadow-sm mr-2.5 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:border-blue-200 transition-colors">
            {task.author.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 leading-tight">{task.author}</span>
            <span className="text-[10px] text-gray-400 font-medium">Verified Requestor</span>
          </div>
        </div>
        
        <div className="relative">
          <Button 
            variant={isAccepted ? "outline" : "primary"} 
            className={`px-4 py-1.5 h-9 text-sm transition-all duration-300 ease-in-out font-semibold ${
              isAccepted 
                ? 'bg-green-50 text-green-700 border-green-200 pointer-events-none' 
                : 'hover:shadow-md hover:-translate-y-0.5'
            }`}
            onClick={handleAcceptClick}
            disabled={isAccepted}
          >
            {isAccepted ? (
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-1.5" />
                Accepted
              </span>
            ) : (
              'Accept Task'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
