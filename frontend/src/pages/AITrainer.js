import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Target,
  Clock,
  Dumbbell,
  Heart,
  TrendingUp,
  Mic,
  MicOff,
  Settings
} from 'lucide-react';

const AITrainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI fitness trainer. I'm here to help you achieve your fitness goals. What would you like to work on today?",
      timestamp: new Date(),
      avatar: '🤖'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "Create a workout plan",
    "Nutrition advice",
    "Track my progress",
    "Motivation tips",
    "Exercise form help"
  ];

  const aiResponses = {
    "Create a workout plan": "I'd be happy to create a personalized workout plan for you! To get started, could you tell me:\n\n• Your fitness goals (strength, cardio, flexibility, etc.)\n• Your current fitness level\n• How many days per week you can work out\n• Any equipment you have access to\n\nThis will help me design the perfect plan for you! 💪",
    
    "Nutrition advice": "Great question! Nutrition is key to achieving your fitness goals. Here are some general tips:\n\n🥗 **Balanced Diet**: Focus on whole foods, lean proteins, complex carbs, and healthy fats\n\n💧 **Hydration**: Aim for 8-10 glasses of water daily\n\n⏰ **Timing**: Eat protein within 30 minutes after workouts\n\n📊 **Tracking**: Consider tracking your macros for better results\n\nWould you like me to create a personalized meal plan based on your goals?",
    
    "Track my progress": "I can help you track your progress! Here's what we can monitor:\n\n📈 **Fitness Metrics**:\n• Workout frequency and duration\n• Strength improvements\n• Cardiovascular endurance\n• Body composition changes\n\n🎯 **Goal Tracking**:\n• Weight loss/gain progress\n• Performance milestones\n• Habit formation\n\nWould you like me to set up a progress tracking system for you?",
    
    "Motivation tips": "Here are some powerful motivation strategies:\n\n🔥 **Set SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound\n\n📅 **Create Habits**: Start with small, consistent actions\n\n🎵 **Find Your Why**: Connect your fitness to deeper life goals\n\n👥 **Build Support**: Share your journey with friends or join our community\n\n🏆 **Celebrate Wins**: Acknowledge every small victory\n\nWhat's your biggest motivation challenge right now?",
    
    "Exercise form help": "Proper form is crucial for safety and results! Here are some key principles:\n\n✅ **Core Principles**:\n• Keep your core engaged\n• Maintain proper alignment\n• Control the movement\n• Breathe consistently\n\n📱 **I can help you with**:\n• Exercise demonstrations\n• Form corrections\n• Alternative exercises\n• Injury prevention tips\n\nWhich exercise would you like me to explain?",
    
    "default": "I'm here to help you with your fitness journey! You can ask me about:\n\n💪 Workout plans and exercises\n🍎 Nutrition and meal planning\n📊 Progress tracking and analytics\n🎯 Goal setting and motivation\n🏥 Injury prevention and recovery\n\nWhat would you like to focus on today?"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content,
      timestamp: new Date(),
      avatar: '👤'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = aiResponses[content] || aiResponses["default"];
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date(),
        avatar: '🤖'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice input
    if (!isListening) {
      setTimeout(() => {
        const voiceInput = "I want to build muscle and lose fat";
        setInputMessage(voiceInput);
        setIsListening(false);
      }, 2000);
    }
  };

  const MessageBubble = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
          message.type === 'ai' 
            ? 'bg-gradient-to-r from-neon-cyan to-neon-blue' 
            : 'bg-gradient-to-r from-neon-magenta to-pink-500'
        }`}>
          {message.avatar}
        </div>
        <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-4 rounded-2xl ${
            message.type === 'user'
              ? 'bg-gradient-to-r from-neon-magenta to-pink-500 text-white'
              : 'bg-dark-card border border-dark-border text-white'
          }`}>
            <div className="whitespace-pre-line">{message.content}</div>
          </div>
          <div className={`text-xs text-gray-400 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 border-b border-dark-border"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-white">AI Trainer</h1>
            <p className="text-gray-400 text-sm">Your personal fitness companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors duration-300"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center">
                🤖
              </div>
              <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-4"
        >
          <p className="text-sm text-gray-400 mb-3">Quick replies:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickReply(reply)}
                className="px-4 py-2 bg-dark-card border border-dark-border rounded-full text-sm text-white hover:border-neon-cyan transition-colors duration-300"
              >
                {reply}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 pb-4"
      >
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-dark-card rounded-lg border border-dark-border">
            <Target className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
            <p className="text-xs text-gray-400">Goals Set</p>
            <p className="text-lg font-bold text-white">12</p>
          </div>
          <div className="text-center p-3 bg-dark-card rounded-lg border border-dark-border">
            <Clock className="w-6 h-6 text-neon-magenta mx-auto mb-2" />
            <p className="text-xs text-gray-400">Sessions</p>
            <p className="text-lg font-bold text-white">47</p>
          </div>
          <div className="text-center p-3 bg-dark-card rounded-lg border border-dark-border">
            <Dumbbell className="w-6 h-6 text-neon-blue mx-auto mb-2" />
            <p className="text-xs text-gray-400">Workouts</p>
            <p className="text-lg font-bold text-white">89</p>
          </div>
          <div className="text-center p-3 bg-dark-card rounded-lg border border-dark-border">
            <TrendingUp className="w-6 h-6 text-neon-green mx-auto mb-2" />
            <p className="text-xs text-gray-400">Progress</p>
            <p className="text-lg font-bold text-white">85%</p>
          </div>
        </div>
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 border-t border-dark-border"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder="Ask your AI trainer anything..."
              className="w-full pl-4 pr-12 py-3 cyber-input focus:border-neon-cyan"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                isListening 
                  ? 'text-red-400 bg-red-500/20' 
                  : 'text-gray-400 hover:text-neon-magenta'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim()}
            className="cyber-button p-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AITrainer; 