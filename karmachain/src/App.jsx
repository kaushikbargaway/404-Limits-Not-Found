import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Login } from './pages/Login';
import { TaskFeed } from './pages/TaskFeed';
import { CreateTask } from './pages/CreateTask';
import { TaskDetails } from './pages/TaskDetails';
import { Profile } from './pages/Profile';
import { MyTasks } from './pages/MyTasks';
import { TopContributorBadge } from './components/layout/TopContributorBadge';

// Layout with Navbar
const AppLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 relative">
    <Navbar />
    <main className="flex-grow w-full">
      <Outlet />
    </main>
    <TopContributorBadge />
  </div>
);

// Guard: redirect to /login if not authenticated
const ProtectedLayout = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <AppLayout />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<TaskFeed />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
