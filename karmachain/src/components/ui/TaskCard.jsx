import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './Card'; // Basic wrappers
import { Button } from './Button';
import { Coins, ShieldCheck, Clock } from 'lucide-react';

export const TaskCard = ({ task, onAccept, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
        <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-sm font-medium">
          <Coins className="w-4 h-4 mr-1" />
          {task.reward}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {task.timeAgo}
        </div>
        <div className="flex items-center">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Min Trust: {task.minTrustScore}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-xs font-bold text-gray-600">
            {task.author.charAt(0)}
          </div>
          <span className="text-sm text-gray-600">{task.author}</span>
        </div>
        <div className="space-x-2">
          {onViewDetails && (
            <Button variant="ghost" className="px-3" onClick={() => onViewDetails(task.id)}>
              Details
            </Button>
          )}
          {onAccept && (
            <Button variant="primary" className="px-3" onClick={() => onAccept(task.id)}>
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
