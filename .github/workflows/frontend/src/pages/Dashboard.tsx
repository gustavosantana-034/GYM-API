import { motion } from 'framer-motion';
import {
    Activity,
    Clock,
    Flame,
    Target,
    TrendingUp,
    Trophy,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for charts
  const weeklyProgress = [
    { day: 'Mon', workouts: 2, calories: 450, time: 45 },
    { day: 'Tue', workouts: 1, calories: 320, time: 30 },
    { day: 'Wed', workouts: 3, calories: 680, time: 65 },
    { day: 'Thu', workouts: 2, calories: 420, time: 40 },
    { day: 'Fri', workouts: 1, calories: 280, time: 25 },
    { day: 'Sat', workouts: 2, calories: 520, time: 50 },
    { day: 'Sun', workouts: 1, calories: 350, time: 35 }
  ];

  const bodyMetrics = [
    { name: 'Muscle', value: 45, color: '#00ffff' },
    { name: 'Fat', value: 15, color: '#ff00ff' },
    { name: 'Water', value: 25, color: '#0080ff' },
    { name: 'Bone', value: 15, color: '#00ff41' }
  ];

  const recentWorkouts = [
    { name: 'Upper Body Strength', duration: '45 min', calories: 320, date: '2 hours ago' },
    { name: 'Cardio HIIT', duration: '30 min', calories: 450, date: 'Yesterday' },
    { name: 'Lower Body Power', duration: '50 min', calories: 380, date: '2 days ago' }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="cyber-card p-6 hover:glow-cyan transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-400 mt-1">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-orbitron font-bold text-neon-cyan">
            {currentTime.toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-400">Live Time</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          title="Current Streak"
          value={user?.stats?.currentStreak || 0}
          subtitle="days"
          color="from-neon-green to-green-500"
          delay={0.1}
        />
        <StatCard
          icon={Target}
          title="Workouts Completed"
          value={user?.stats?.workoutsCompleted || 0}
          subtitle="total"
          color="from-neon-magenta to-pink-500"
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          title="Total Time"
          value={`${user?.stats?.totalTime || 0}h`}
          subtitle="this month"
          color="from-neon-blue to-blue-500"
          delay={0.3}
        />
        <StatCard
          icon={Flame}
          title="Calories Burned"
          value="2,847"
          subtitle="this week"
          color="from-orange-500 to-red-500"
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 text-neon-cyan mr-2" />
            Weekly Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyProgress}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0.1}/>
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
              <Area 
                type="monotone" 
                dataKey="calories" 
                stroke="#00ffff" 
                fillOpacity={1} 
                fill="url(#colorCalories)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Body Composition Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 text-neon-magenta mr-2" />
            Body Composition
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bodyMetrics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {bodyMetrics.map((entry, index) => (
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
          <div className="grid grid-cols-2 gap-4 mt-4">
            {bodyMetrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: metric.color }}
                ></div>
                <span className="text-sm text-gray-300">{metric.name}: {metric.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="cyber-card p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-neon-green mr-2" />
            Recent Workouts
          </h3>
          <div className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-neon-cyan transition-colors duration-300"
              >
                <div>
                  <h4 className="font-medium text-white">{workout.name}</h4>
                  <p className="text-sm text-gray-400">{workout.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neon-cyan">{workout.duration}</p>
                  <p className="text-xs text-gray-500">{workout.calories} cal</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 text-neon-blue mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full cyber-button">
              Start Workout
            </button>
            <button className="w-full bg-dark-bg border border-dark-border text-white py-3 px-4 rounded-lg hover:border-neon-magenta transition-colors duration-300">
              Schedule Session
            </button>
            <button className="w-full bg-dark-bg border border-dark-border text-white py-3 px-4 rounded-lg hover:border-neon-green transition-colors duration-300">
              View Progress
            </button>
            <button className="w-full bg-dark-bg border border-dark-border text-white py-3 px-4 rounded-lg hover:border-neon-purple transition-colors duration-300">
              Chat with AI
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 