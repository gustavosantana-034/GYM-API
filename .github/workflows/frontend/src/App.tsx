import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import WorkoutPlanner from './pages/WorkoutPlanner';
import ActivityTracker from './pages/ActivityTracker';
import Membership from './pages/Membership';
import AITrainer from './pages/AITrainer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import IconTest from './components/IconTest';
import DebugIcons from './components/DebugIcons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRouteProps, AppLayoutProps } from './types';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main App Layout
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 cyber-grid">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/icon-test" element={<IconTest />} />
      <Route path="/debug-icons" element={<DebugIcons />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout-planner"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WorkoutPlanner />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity-tracker"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ActivityTracker />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/membership"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Membership />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-trainer"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AITrainer />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 