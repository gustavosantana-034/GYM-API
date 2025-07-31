import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  Play,
  Pause,
  Square,
  Clock,
  Target,
  Flame,
  TrendingUp,
  BarChart3,
  Timer,
  Zap,
  Heart,
  Gauge
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ActivityTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      name: 'Morning Cardio',
      duration: 45,
      calories: 320,
      heartRate: 145,
      date: '2024-01-15',
      type: 'Cardio'
    },
    {
      id: 2,
      name: 'Strength Training',
      duration: 60,
      calories: 450,
      heartRate: 130,
      date: '2024-01-14',
      type: 'Strength'
    },
    {
      id: 3,
      name: 'HIIT Session',
      duration: 30,
      calories: 380,
      heartRate: 160,
      date: '2024-01-13',
      type: 'HIIT'
    }
  ]);

  const [realTimeData, setRealTimeData] = useState([
    { time: 0, heartRate: 80, calories: 0 },
    { time: 5, heartRate: 120, calories: 25 },
    { time: 10, heartRate: 140, calories: 50 },
    { time: 15, heartRate: 155, calories: 85 },
    { time: 20, heartRate: 145, calories: 120 },
    { time: 25, heartRate: 135, calories: 155 },
    { time: 30, heartRate: 125, calories: 180 }
  ]);

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Simulate real-time data updates
        setRealTimeData(prev => {
          const newData = [...prev];
          const lastEntry = newData[newData.length - 1];
          const newEntry = {
            time: lastEntry.time + 5,
            heartRate: Math.floor(Math.random() * 40) + 120,
            calories: lastEntry.calories + Math.floor(Math.random() * 30) + 10
          };
          return [...newData, newEntry];
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const startSession = () => {
    setIsTracking(true);
    setSessionTime(0);
    setCurrentSession({
      id: Date.now(),
      name: 'Active Session',
      startTime: new Date(),
      type: 'Mixed'
    });
  };

  const pauseSession = () => {
    setIsTracking(false);
  };

  const stopSession = () => {
    setIsTracking(false);
    if (currentSession) {
      const newSession = {
        ...currentSession,
        duration: Math.floor(sessionTime / 60),
        calories: Math.floor(sessionTime * 0.1),
        heartRate: Math.floor(Math.random() * 40) + 120,
        date: new Date().toISOString().split('T')[0],
        endTime: new Date()
      };
      setSessions([newSession, ...sessions]);
      setCurrentSession(null);
      setSessionTime(0);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
          <h1 className="text-3xl font-orbitron font-bold text-white flex items-center">
            <Activity className="w-8 h-8 text-neon-blue mr-3" />
            Activity Tracker
          </h1>
          <p className="text-gray-400 mt-1">Monitor your real-time fitness metrics</p>
        </div>
      </motion.div>

      {/* Live Session Controls */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cyber-card p-6 border-2 border-neon-cyan glow-cyan"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Live Session</h2>
            <div className="text-3xl font-orbitron font-bold text-neon-cyan">
              {formatTime(sessionTime)}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            {!isTracking ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startSession}
                className="cyber-button flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Resume</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseSession}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopSession}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Quick Start */}
      {!currentSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-6 text-center"
        >
          <Activity className="w-16 h-16 text-neon-cyan mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Ready to track your workout?</h2>
          <p className="text-gray-400 mb-6">Start a new session to begin monitoring your fitness metrics</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSession}
            className="cyber-button flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Start Session</span>
          </motion.button>
        </motion.div>
      )}

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Timer}
          title="Session Time"
          value={formatTime(sessionTime)}
          subtitle="current session"
          color="from-neon-cyan to-blue-500"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          title="Calories Burned"
          value={Math.floor(sessionTime * 0.1)}
          subtitle="this session"
          color="from-orange-500 to-red-500"
          delay={0.2}
        />
        <StatCard
          icon={Heart}
          title="Heart Rate"
          value="145"
          subtitle="BPM"
          color="from-red-500 to-pink-500"
          delay={0.3}
        />
        <StatCard
          icon={Gauge}
          title="Intensity"
          value="85%"
          subtitle="max effort"
          color="from-neon-magenta to-purple-500"
          delay={0.4}
        />
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 text-red-400 mr-2" />
            Heart Rate Monitor
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realTimeData}>
              <defs>
                <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff0000" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="time" stroke="#666" />
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
                dataKey="heartRate" 
                stroke="#ff0000" 
                strokeWidth={2}
                dot={{ fill: '#ff0000', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Calories Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Flame className="w-5 h-5 text-orange-400 mr-2" />
            Calories Burned
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={realTimeData}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="time" stroke="#666" />
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
                stroke="#ff6b35" 
                fillOpacity={1} 
                fill="url(#colorCalories)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="cyber-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 text-neon-green mr-2" />
          Recent Sessions
        </h3>
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-neon-cyan transition-colors duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{session.name}</h4>
                  <p className="text-sm text-gray-400">{session.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-lg font-semibold text-neon-cyan">{session.duration} min</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Calories</p>
                  <p className="text-lg font-semibold text-orange-400">{session.calories}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Heart Rate</p>
                  <p className="text-lg font-semibold text-red-400">{session.heartRate} BPM</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="text-lg font-semibold text-neon-magenta">{session.type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityTracker; 