import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Upload } from '../components/ui/Upload';
import { ShieldCheck, Clock, Coins, MapPin, User, CheckCircle2 } from 'lucide-react';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proof, setProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('accepted'); // accepted, verifying, completed

  // Mock task data based on ID
  const task = {
    id: id,
    title: 'Clean up the local park',
    description: 'We need volunteers to help clean up the Central Park this weekend. Bags and gloves will be provided. Please upload a before/after picture as proof of work. Make sure to cover the children playground area specifically.',
    reward: '50',
    timeAgo: '2h ago',
    minTrustScore: 20,
    author: 'CommunityBoard',
    location: 'Central Park West',
    status: 'open'
  };

  const handleSubmitProof = () => {
    if (!proof) return;
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('verifying');
      console.log('Proof uploaded:', proof);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center">
          ← Back to Feed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{task.title}</h1>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {task.timeAgo}
                </div>
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {task.location}
                </div>
                <div className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg font-medium">
                  <Coins className="w-4 h-4 mr-2 text-blue-500" />
                  {task.reward} KC
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {status === 'accepted' && (
            <Card>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Proof of Work</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload photos or documents demonstrating that you have completed this task. The task author will review this before releasing funds.
                </p>
                <div className="mb-6">
                  <Upload 
                    onChange={(file) => setProof(file)} 
                    label=""
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="primary" 
                    onClick={handleSubmitProof} 
                    disabled={!proof || isSubmitting}
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit Proof'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {status === 'verifying' && (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Proof Submitted</h3>
                <p className="text-gray-600 max-w-md">
                  Your proof is currently under review by the task author. You will receive {task.reward} KC once approved.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">Task Information</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Author</div>
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {task.author}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Min Trust Required</div>
                  <div className="flex items-center text-emerald-700">
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                    {task.minTrustScore} Score
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Task Status</div>
                  <div className="flex items-center text-blue-700">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    In Progress
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
