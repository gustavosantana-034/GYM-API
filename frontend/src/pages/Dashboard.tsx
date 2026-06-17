import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { checkInService } from '../services/checkInService';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Activity, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Target, 
  Calendar,
  CheckCircle,
  Zap,
  BarChart3,
  Heart,
  Flame,
  Award,
  Search,
  Plus
} from 'lucide-react';
import { CheckIn, CheckInMetrics, Gym } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [checkInMetrics, setCheckInMetrics] = useState<CheckInMetrics | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [nearbyGyms, setNearbyGyms] = useState<Gym[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    loadDashboardData();
    getUserLocation();
    
    // Add some example notifications for demonstration
    setTimeout(() => {
      showNotification({
        type: 'info',
        title: 'Welcome to CyberFit!',
        message: 'Your fitness journey starts here. Check into nearby gyms to get started.',
        persistent: true
      });
    }, 1000);
  }, [showNotification]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsData, checkInsData] = await Promise.all([
        checkInService.getCheckInMetrics(),
        checkInService.getCheckInHistory()
      ]);
      
      setCheckInMetrics(metricsData);
      setRecentCheckIns(checkInsData.slice(0, 5)); // Last 5 check-ins
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          loadNearbyGyms(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const loadNearbyGyms = async (lat: number, lng: number) => {
    try {
      const gyms = await checkInService.getNearbyGyms(lat, lng);
      setNearbyGyms(gyms.slice(0, 3)); // Top 3 nearby gyms
    } catch (error) {
      console.error('Error loading nearby gyms:', error);
    }
  };

  const handleQuickCheckIn = async (gymId: string) => {
    if (!userLocation) {
      showNotification({
        type: 'error',
        title: 'Location Required',
        message: 'Please enable location access for check-in'
      });
      return;
    }

    try {
      const result = await checkInService.createCheckIn(
        gymId,
        userLocation.latitude,
        userLocation.longitude
      );
      
      if (result.success) {
        showNotification({
          type: 'success',
          title: 'Check-in Successful!',
          message: 'Your check-in has been recorded successfully.'
        });
        loadDashboardData(); // Refresh data
              } else {
          showNotification({
            type: 'error',
            title: 'Check-in Failed',
            message: result.error || 'Unable to complete check-in'
          });
        }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Check-in Error',
        message: 'An error occurred while processing your check-in'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color, delay }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="cyber-card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400">Ready for your next workout session?</p>
          </div>
          <Avatar user={user} size="lg" className="border-4 border-neon-cyan" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Activity}
          title="Total Check-ins"
          value={checkInMetrics?.check_ins_count || 0}
          subtitle="current month"
          color="from-neon-cyan to-blue-500"
          delay={0.2}
        />
        <StatCard
          icon={TrendingUp}
          title="Current Streak"
          value={user?.stats?.currentStreak || 0}
          subtitle="days"
          color="from-orange-500 to-red-500"
          delay={0.3}
        />
        <StatCard
          icon={Target}
          title="Goal Progress"
          value="85%"
          subtitle="monthly target"
          color="from-purple-500 to-pink-500"
          delay={0.4}
        />
        <StatCard
          icon={Calendar}
          title="This Week"
          value={checkInMetrics?.check_ins_count || 0}
          subtitle="check-ins"
          color="from-green-500 to-emerald-500"
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Check-in Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2"
        >
          <div className="cyber-card p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <MapPin className="w-6 h-6 text-neon-cyan mr-3" />
                Quick Check-in
              </h2>
              <button className="cyber-button flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Find More Gyms</span>
              </button>
            </div>
            
            {nearbyGyms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyGyms.map((gym) => (
                  <motion.div
                    key={gym.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-dark-bg border border-dark-border rounded-lg p-4 hover:border-neon-cyan transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white truncate">{gym.title}</h3>
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse flex-shrink-0 ml-2"></div>
                    </div>
                    {gym.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{gym.description}</p>
                    )}
                    <button
                      onClick={() => handleQuickCheckIn(gym.id)}
                      className="cyber-button w-full flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Check-in</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No nearby gyms found</p>
                <p className="text-gray-500 text-sm mt-1">Enable location access to find gyms near you</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="cyber-card p-6 h-full">
            <h2 className="text-xl font-semibold text-white flex items-center mb-6">
              <Activity className="w-5 h-5 text-neon-green mr-2" />
              Recent Activity
            </h2>
            
            {recentCheckIns.length > 0 ? (
              <div className="space-y-4">
                {recentCheckIns.map((checkIn) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 bg-dark-bg rounded-lg border border-dark-border"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">{checkIn.gym.title}</h4>
                      <p className="text-xs text-gray-400">{formatDate(checkIn.created_at)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {checkIn.validated_at ? (
                        <span className="text-xs text-neon-green font-semibold">✓ Validated</span>
                      ) : (
                        <span className="text-xs text-yellow-400 font-semibold">⏳ Pending</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No recent check-ins</p>
                <p className="text-gray-500 text-xs mt-1">Start by checking into a gym!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="cyber-card p-6"
      >
        <h2 className="text-xl font-semibold text-white flex items-center mb-6">
          <Zap className="w-5 h-5 text-neon-blue mr-2" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cyber-button flex items-center justify-center space-x-3 py-4"
          >
            <MapPin className="w-5 h-5" />
            <span>Find Nearby Gyms</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cyber-button flex items-center justify-center space-x-3 py-4"
          >
            <BarChart3 className="w-5 h-5" />
            <span>View Analytics</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cyber-button flex items-center justify-center space-x-3 py-4"
          >
            <Plus className="w-5 h-5" />
            <span>Start Workout</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 