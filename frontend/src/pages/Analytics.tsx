import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { checkInService } from '../services/checkInService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Clock, 
  Target,
  CheckCircle,
  Activity,
  Zap,
  Award,
  Users,
  Star
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CheckIn, CheckInMetrics } from '../types';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [checkInMetrics, setCheckInMetrics] = useState<CheckInMetrics | null>(null);
  const [checkInHistory, setCheckInHistory] = useState<CheckIn[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [metricsData, historyData] = await Promise.all([
        checkInService.getCheckInMetrics(),
        checkInService.getCheckInHistory()
      ]);
      
      setCheckInMetrics(metricsData);
      setCheckInHistory(historyData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load analytics data'
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (in a real app, this would come from the backend)
  const weeklyData = [
    { day: 'Mon', checkIns: 2, goal: 3 },
    { day: 'Tue', checkIns: 1, goal: 3 },
    { day: 'Wed', checkIns: 3, goal: 3 },
    { day: 'Thu', checkIns: 2, goal: 3 },
    { day: 'Fri', checkIns: 1, goal: 3 },
    { day: 'Sat', checkIns: 2, goal: 3 },
    { day: 'Sun', checkIns: 1, goal: 3 }
  ];

  const monthlyData = [
    { month: 'Jan', checkIns: 45 },
    { month: 'Feb', checkIns: 52 },
    { month: 'Mar', checkIns: 48 },
    { month: 'Apr', checkIns: 61 },
    { month: 'May', checkIns: 55 },
    { month: 'Jun', checkIns: 58 }
  ];

  const gymUsageData = [
    { name: 'Gym A', value: 35, color: '#00ffff' },
    { name: 'Gym B', value: 25, color: '#ff00ff' },
    { name: 'Gym C', value: 20, color: '#0080ff' },
    { name: 'Gym D', value: 20, color: '#00ff41' }
  ];

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
      className="cyber-card p-6 hover:glow-cyan transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-orbitron font-bold text-white flex items-center">
            <BarChart3 className="w-10 h-10 text-neon-blue mr-4" />
            Analytics
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Your fitness journey in numbers</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={CheckCircle}
          title="Total Check-ins"
          value={checkInMetrics?.total_check_ins_count || 0}
          subtitle="all time"
          color="from-neon-green to-green-500"
          delay={0.1}
        />
        <StatCard
          icon={Calendar}
          title="This Month"
          value={checkInMetrics?.check_ins_count || 0}
          subtitle="current month"
          color="from-neon-cyan to-blue-500"
          delay={0.2}
        />
        <StatCard
          icon={TrendingUp}
          title="Current Streak"
          value={user?.stats.currentStreak || 0}
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
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 text-neon-cyan mr-3" />
            Weekly Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <defs>
                <linearGradient id="colorCheckIns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff00ff" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="checkIns" fill="url(#colorCheckIns)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="goal" fill="url(#colorGoal)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 text-neon-green mr-3" />
            Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff41" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00ff41" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="checkIns" 
                stroke="#00ff41" 
                strokeWidth={3}
                fill="url(#colorTrend)"
                dot={{ fill: '#00ff41', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Gym Usage & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gym Usage Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="cyber-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <MapPin className="w-6 h-6 text-neon-magenta mr-3" />
            Gym Usage
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={gymUsageData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {gymUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {gymUsageData.map((gym, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: gym.color }}
                ></div>
                <span className="text-sm text-gray-300">{gym.name}: {gym.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Check-ins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2"
        >
          <div className="cyber-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Clock className="w-6 h-6 text-neon-cyan mr-3" />
              Recent Check-ins
            </h3>
            
            {checkInHistory.length > 0 ? (
              <div className="space-y-4">
                {checkInHistory.slice(0, 8).map((checkIn, index) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-neon-cyan transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{checkIn.gym.title}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(checkIn.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {checkIn.validated_at ? (
                        <span className="text-sm text-neon-green font-semibold flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Validated
                        </span>
                      ) : (
                        <span className="text-sm text-yellow-400 font-semibold flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No check-ins yet</p>
                <p className="text-gray-500 text-sm mt-1">Start by checking into a gym!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Achievements & Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="cyber-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Award className="w-6 h-6 text-neon-yellow mr-3" />
          Achievements & Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-dark-bg rounded-lg border border-dark-border">
            <Star className="w-12 h-12 text-neon-yellow mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Consistency Master</h4>
            <p className="text-sm text-gray-400">12 days streak achieved!</p>
          </div>
          
          <div className="text-center p-4 bg-dark-bg rounded-lg border border-dark-border">
            <Users className="w-12 h-12 text-neon-cyan mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Gym Explorer</h4>
            <p className="text-sm text-gray-400">Visited 4 different gyms</p>
          </div>
          
          <div className="text-center p-4 bg-dark-bg rounded-lg border border-dark-border">
            <Zap className="w-12 h-12 text-neon-green mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Early Bird</h4>
            <p className="text-sm text-gray-400">Most check-ins before 8 AM</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
