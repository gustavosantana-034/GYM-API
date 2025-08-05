import { motion } from 'framer-motion';
import {
  Bell,
  LogOut,
  Search,
  Settings,
  User,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleLogout = (): void => {
    logout();
    setShowProfileMenu(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const toggleProfileMenu = (): void => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <motion.nav 
      className="bg-dark-card border-b border-dark-border px-6 py-4 backdrop-blur-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      // @ts-ignore
    >
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-orbitron font-bold text-neon-cyan neon-text">
              CyberFit
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workouts, exercises..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-400 hover:text-neon-cyan transition-colors duration-300"

          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon-magenta rounded-full animate-pulse"></span>
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors duration-300"
          >
            <Settings className="w-6 h-6" />
          </motion.button>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleProfileMenu}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-bg transition-colors duration-300"
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-neon-cyan"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-neon-cyan capitalize">{user?.membership}</p>
              </div>
            </motion.button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50"
              >
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-dark-bg hover:text-white transition-colors duration-300">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-dark-bg hover:text-white transition-colors duration-300">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="border-dark-border my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:bg-dark-bg hover:text-red-300 transition-colors duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 