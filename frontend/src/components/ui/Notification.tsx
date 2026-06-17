import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  onClose,
  duration = 5000
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-neon-green" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-neon-cyan" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-neon-green/50';
      case 'error':
        return 'border-red-400/50';
      case 'warning':
        return 'border-yellow-400/50';
      default:
        return 'border-neon-cyan/50';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-neon-green/10';
      case 'error':
        return 'bg-red-400/10';
      case 'warning':
        return 'bg-yellow-400/10';
      default:
        return 'bg-neon-cyan/10';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`cyber-card p-4 border ${getBorderColor()} ${getBgColor()} backdrop-blur-lg shadow-2xl max-w-sm`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-semibold text-white">
                {title}
              </h4>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {message}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <motion.div
            className="h-1 bg-gray-700 rounded-full mt-3 overflow-hidden"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          >
            <div className={`h-full ${getBorderColor().replace('border-', 'bg-').replace('/50', '')}`} />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
