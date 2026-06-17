import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Edit3, 
  X,
  Crown,
  Trophy,
  Target,
  TrendingUp,
  Weight,
  Activity
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    weight: user?.stats.weight || 70.0,
    bodyFat: user?.stats.bodyFat || 15.0
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please select an image file'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Please select an image smaller than 5MB'
      });
      return;
    }

    setUploadingImage(true);
    try {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateUser({ avatar: result });
        showNotification({
          type: 'success',
          title: 'Avatar Updated',
          message: 'Your profile picture has been updated'
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload image. Please try again.'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update user data
      updateUser({
        name: formData.name,
        email: formData.email,
        stats: {
          ...user?.stats,
          weight: formData.weight,
          bodyFat: formData.bodyFat
        }
      });

      showNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully'
      });
      setIsEditing(false);
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      weight: user?.stats.weight || 70.0,
      bodyFat: user?.stats.bodyFat || 15.0
    });
    setIsEditing(false);
  };

  const getMembershipColor = (membership: string) => {
    switch (membership) {
      case 'premium': return 'text-yellow-400';
      case 'pro': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getMembershipIcon = (membership: string) => {
    switch (membership) {
      case 'premium': return <Crown className="w-5 h-5" />;
      case 'pro': return <Trophy className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white flex items-center">
            <User className="w-8 h-8 text-neon-blue mr-3" />
            Profile
          </h1>
          <p className="text-gray-400 mt-1">Manage your account and preferences</p>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="cyber-button flex items-center space-x-2"
          >
            <Edit3 className="w-5 h-5" />
            <span>Edit Profile</span>
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card p-6"
        >
          <div className="text-center">
            {/* Avatar Section */}
            <div className="relative inline-block mb-6">
              <Avatar user={user} size="xl" className="mb-4" />
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 bg-neon-cyan text-black p-2 rounded-full hover:bg-cyan-400 transition-colors duration-200"
                >
                  {uploadingImage ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </motion.button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-gray-400 mb-4">{user.email}</p>
            
            {/* Membership */}
            <div className={`flex items-center justify-center space-x-2 mb-4 ${getMembershipColor(user.membership)}`}>
              {getMembershipIcon(user.membership)}
              <span className="font-semibold capitalize">{user.membership} Member</span>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.stats.workoutsCompleted}</p>
                <p className="text-sm text-gray-400">Workouts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.stats.currentStreak}</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
                 <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="lg:col-span-2 space-y-8"
         >
          {/* Personal Information */}
          <div className="cyber-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-6 h-6 text-neon-cyan mr-2" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-white">{user.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-white">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Body Metrics */}
          <div className="cyber-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="w-6 h-6 text-neon-green mr-2" />
              Body Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Weight (kg)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                    placeholder="Enter your weight"
                  />
                ) : (
                  <p className="text-white">{user.stats.weight} kg</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Body Fat (%)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                    placeholder="Enter body fat percentage"
                  />
                ) : (
                  <p className="text-white">{user.stats.bodyFat}%</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={loading}
                className="cyber-button flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
