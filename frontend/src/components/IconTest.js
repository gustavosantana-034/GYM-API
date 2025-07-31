import React from 'react';
import { Mail, Lock, Eye, Zap } from 'lucide-react';
import { MdEmail, MdLock, MdVisibility, MdFlashOn } from 'react-icons/md';

const IconTest = () => {
  return (
    <div className="p-8 bg-dark-bg text-white">
      <h2 className="text-2xl font-bold mb-6">Icon Test</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Lucide React Icons</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-neon-cyan" />
              <span>Mail Icon</span>
            </div>
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-neon-magenta" />
              <span>Lock Icon</span>
            </div>
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-neon-blue" />
              <span>Eye Icon</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-neon-green" />
              <span>Zap Icon</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">React Icons (Fallback)</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MdEmail className="w-6 h-6 text-neon-cyan" />
              <span>Mail Icon</span>
            </div>
            <div className="flex items-center space-x-3">
              <MdLock className="w-6 h-6 text-neon-magenta" />
              <span>Lock Icon</span>
            </div>
            <div className="flex items-center space-x-3">
              <MdVisibility className="w-6 h-6 text-neon-blue" />
              <span>Eye Icon</span>
            </div>
            <div className="flex items-center space-x-3">
              <MdFlashOn className="w-6 h-6 text-neon-green" />
              <span>Zap Icon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconTest; 