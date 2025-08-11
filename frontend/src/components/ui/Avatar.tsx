import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface AvatarProps {
  user?: {
    name: string;
    avatar?: string;
  } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl'
  };

  const getInitials = (name: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${sizeClasses[size]} bg-gray-600 rounded-full flex items-center justify-center ${className}`}
      >
        <User className="w-1/2 h-1/2 text-gray-400" />
      </motion.div>
    );
  }

  if (user.avatar) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center text-white font-semibold hidden`}>
          {getInitials(user.name)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${sizeClasses[size]} bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center text-white font-semibold ${className}`}
    >
      {getInitials(user.name)}
    </motion.div>
  );
};

export default Avatar;
