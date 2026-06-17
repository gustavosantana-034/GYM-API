import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Activity, 
  Crown, 
  MessageSquare,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      path: '/',
      icon: Home,
      label: 'Dashboard',
      color: 'text-neon-cyan'
    },
    {
      path: '/workout-planner',
      icon: Calendar,
      label: 'Workout Planner',
      color: 'text-neon-magenta'
    },
    {
      path: '/activity-tracker',
      icon: Activity,
      label: 'Activity Tracker',
      color: 'text-neon-blue'
    },
    {
      path: '/membership',
      icon: Crown,
      label: 'Membership',
      color: 'text-neon-purple'
    },
    {
      path: '/ai-trainer',
      icon: MessageSquare,
      label: 'AI Trainer',
      color: 'text-neon-green'
    }
  ];

  return (
    <motion.aside 
      className="w-64 bg-dark-card border-r border-dark-border flex flex-col"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-orbitron font-bold text-neon-cyan neon-text">
              CyberFit
            </h2>
            <p className="text-xs text-gray-400">Futuristic Fitness</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 text-neon-cyan'
                      : 'text-gray-400 hover:text-white hover:bg-dark-bg'
                  }`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-5 h-5 ${item.color}`}
                >
                  <item.icon />
                </motion.div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-dark-border">
        <div className="cyber-card p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-neon-green" />
                <span className="text-xs text-gray-400">Streak</span>
              </div>
              <span className="text-sm font-bold text-neon-green">12 days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-neon-magenta" />
                <span className="text-xs text-gray-400">Goal</span>
              </div>
              <span className="text-sm font-bold text-neon-magenta">85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <div className="cyber-card p-4 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full mx-auto mb-3 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs text-gray-400 mb-2">Ready to train?</p>
          <button className="cyber-button text-xs px-4 py-2">
            Start Workout
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar; 