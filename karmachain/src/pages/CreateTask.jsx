import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export const CreateTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    minTrustScore: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Task Created:', formData);
    // API Call Placeholder
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create a Task</h1>
        <p className="text-gray-500 mt-1">Need help? Post a task and set a reward to find trustworthy volunteers.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Clean up the local park"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 border bg-white"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description & Requirements
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what needs to be done and how the proof of work should look like..."
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 border bg-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-1">
                  Reward (KarmaCoins)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="reward"
                    name="reward"
                    required
                    min="1"
                    value={formData.reward}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 border bg-white"
                    placeholder="50"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm font-medium">KC</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="minTrustScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Trust Score required
                </label>
                <input
                  type="number"
                  id="minTrustScore"
                  name="minTrustScore"
                  required
                  min="0"
                  value={formData.minTrustScore}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 border bg-white"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm & Create Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
