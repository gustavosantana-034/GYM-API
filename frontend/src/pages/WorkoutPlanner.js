import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  Target,
  Flame,
  Dumbbell,
  Play,
  Pause,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const WorkoutPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: 'Upper Body Strength',
      date: '2024-01-15',
      duration: '45 min',
      type: 'Strength',
      exercises: ['Bench Press', 'Pull-ups', 'Overhead Press', 'Rows'],
      completed: false
    },
    {
      id: 2,
      name: 'Cardio HIIT',
      date: '2024-01-16',
      duration: '30 min',
      type: 'Cardio',
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'Planks'],
      completed: true
    },
    {
      id: 3,
      name: 'Lower Body Power',
      date: '2024-01-17',
      duration: '50 min',
      type: 'Power',
      exercises: ['Squats', 'Deadlifts', 'Lunges', 'Calf Raises'],
      completed: false
    }
  ]);

  const workoutTypes = [
    { name: 'Strength', color: 'neon-cyan', icon: Dumbbell },
    { name: 'Cardio', color: 'neon-magenta', icon: Flame },
    { name: 'Power', color: 'neon-blue', icon: Target },
    { name: 'Flexibility', color: 'neon-green', icon: Clock }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getWorkoutsForDate = (date) => {
    const dateStr = formatDate(date);
    return workouts.filter(workout => workout.date === dateStr);
  };

  const toggleWorkoutCompletion = (workoutId) => {
    setWorkouts(workouts.map(workout => 
      workout.id === workoutId 
        ? { ...workout, completed: !workout.completed }
        : workout
    ));
  };

  const CalendarDay = ({ date, isCurrentMonth, isSelected, hasWorkouts }) => {
    if (!date) return <div className="h-24"></div>;

    const dayWorkouts = getWorkoutsForDate(date);
    const isToday = formatDate(date) === formatDate(new Date());

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedDate(date)}
        className={`
          h-24 p-2 border border-dark-border cursor-pointer transition-all duration-300
          ${isCurrentMonth ? 'bg-dark-card' : 'bg-dark-bg opacity-50'}
          ${isSelected ? 'border-neon-cyan glow-cyan' : 'hover:border-neon-magenta'}
          ${isToday ? 'ring-2 ring-neon-green' : ''}
        `}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${isToday ? 'text-neon-green' : 'text-white'}`}>
            {date.getDate()}
          </span>
          {hasWorkouts && (
            <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
          )}
        </div>
        
        {dayWorkouts.length > 0 && (
          <div className="space-y-1">
            {dayWorkouts.slice(0, 2).map((workout, index) => (
              <div
                key={workout.id}
                className={`
                  text-xs p-1 rounded truncate flex items-center space-x-1
                  ${workout.completed ? 'bg-green-500/20 text-green-400' : 'bg-neon-cyan/20 text-neon-cyan'}
                `}
              >
                {workout.completed ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                <span>{workout.name}</span>
              </div>
            ))}
            {dayWorkouts.length > 2 && (
              <div className="text-xs text-gray-400 text-center">
                +{dayWorkouts.length - 2} more
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

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
            <Calendar className="w-8 h-8 text-neon-magenta mr-3" />
            Workout Planner
          </h1>
          <p className="text-gray-400 mt-1">Plan and track your fitness journey</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddWorkout(true)}
          className="cyber-button flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Workout</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6 lg:col-span-2"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 text-gray-400 hover:text-neon-cyan transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 text-gray-400 hover:text-neon-cyan transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-8 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-400">{day}</span>
              </div>
            ))}
            
            {/* Calendar Days */}
            {getDaysInMonth(currentDate).map((date, index) => (
              <CalendarDay
                key={index}
                date={date}
                isCurrentMonth={date && date.getMonth() === currentDate.getMonth()}
                isSelected={date && formatDate(date) === formatDate(selectedDate)}
                hasWorkouts={date && getWorkoutsForDate(date).length > 0}
              />
            ))}
          </div>
        </motion.div>

        {/* Selected Date Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>

          {getWorkoutsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No workouts scheduled</p>
              <button className="cyber-button text-sm">
                Add Workout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {getWorkoutsForDate(selectedDate).map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    workout.completed 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-dark-bg border-dark-border hover:border-neon-cyan'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{workout.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleWorkoutCompletion(workout.id)}
                        className={`p-1 rounded ${
                          workout.completed 
                            ? 'text-green-400 hover:text-green-300' 
                            : 'text-gray-400 hover:text-neon-cyan'
                        }`}
                      >
                        {workout.completed ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button className="p-1 text-gray-400 hover:text-neon-magenta">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{workout.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{workout.type}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center space-x-2">
                        <div className="w-1 h-1 bg-neon-cyan rounded-full"></div>
                        <span>{exercise}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Workout Types Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="cyber-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Workout Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {workoutTypes.map((type) => (
            <div key={type.name} className="flex items-center space-x-3 p-3 bg-dark-bg rounded-lg">
              <div className={`w-8 h-8 bg-${type.color} rounded-lg flex items-center justify-center`}>
                <type.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">{type.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutPlanner; 