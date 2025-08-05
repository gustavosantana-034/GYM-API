import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LoginFormData } from '../types';
// Icons are now using React Icons for better compatibility
import { 
  MdEmail, 
  MdLock, 
  MdVisibility, 
  MdVisibilityOff, 
  MdFlashOn,
  MdArrowForward,
  MdError
} from 'react-icons/md';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = (): void => {
    // TODO: Implement Google login
    console.log('Google login clicked');
  };

  const handleFacebookLogin = (): void => {
    // TODO: Implement Facebook login
    console.log('Facebook login clicked');
  };

  return (
    <div className="min-h-screen bg-dark-bg cyber-grid flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <MdFlashOn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-orbitron font-bold text-neon-cyan neon-text mb-2">
            CyberFit
          </h1>
          <p className="text-gray-400">Access your futuristic fitness journey</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="cyber-card p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-6"
            >
              <MdError className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 cyber-input focus:border-neon-cyan"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 cyber-input focus:border-neon-cyan"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-neon-cyan bg-dark-bg border-dark-border rounded focus:ring-neon-cyan"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-neon-cyan hover:text-neon-blue transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full cyber-button py-3 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <MdArrowForward className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-dark-border"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-dark-border"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-dark-bg border border-dark-border text-white py-3 px-4 rounded-lg hover:border-neon-magenta transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full"></div>
              <span>Continue with Google</span>
            </button>
            <button 
              onClick={handleFacebookLogin}
              className="w-full bg-dark-bg border border-dark-border text-white py-3 px-4 rounded-lg hover:border-neon-blue transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-neon-cyan hover:text-neon-blue transition-colors duration-300 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">
            © 2024 CyberFit. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login; 