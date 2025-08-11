import React, { useState } from 'react';
import { Mail, Lock, Eye, Zap } from 'lucide-react';
import Icon from './ui/Icon';

const DebugIcons: React.FC = () => {
  const [useFallback, setUseFallback] = useState<boolean>(false);

  return (
    <div className="p-8 bg-dark-bg text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Icon Debug Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={() => setUseFallback(!useFallback)}
          className="cyber-button mb-4"
        >
          {useFallback ? 'Use Lucide React' : 'Use React Icons Fallback'}
        </button>
        <p className="text-gray-400">Current mode: {useFallback ? 'React Icons' : 'Lucide React'}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Direct Lucide React Icons</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Mail className="w-6 h-6 text-neon-cyan" />
              <span>Mail Icon</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Lock className="w-6 h-6 text-neon-magenta" />
              <span>Lock Icon</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Eye className="w-6 h-6 text-neon-blue" />
              <span>Eye Icon</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Zap className="w-6 h-6 text-neon-green" />
              <span>Zap Icon</span>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Custom Icon Component</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Icon name="mail" fallback={useFallback} className="w-6 h-6 text-neon-cyan" />
              <span>Mail Icon</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Icon name="lock" fallback={useFallback} className="w-6 h-6 text-neon-magenta" />
              <span>Lock Icon</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Icon name="eye" fallback={useFallback} className="w-6 h-6 text-neon-blue" />
              <span>Eye Icon</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-card rounded">
              <Icon name="zap" fallback={useFallback} className="w-6 h-6 text-neon-green" />
              <span>Zap Icon</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-dark-card rounded">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <p className="text-gray-400">
          If you see broken squares or missing icons in the left column, it means Lucide React is not loading properly. 
          The right column shows the custom Icon component which can fallback to React Icons.
        </p>
      </div>
    </div>
  );
};

export default DebugIcons; 