import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown,
  Check,
  Star,
  Zap,
  Shield,
  Users,
  Target,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Membership = () => {
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      period: 'month',
      color: 'neon-cyan',
      icon: Target,
      features: [
        'Access to basic workouts',
        'Progress tracking',
        'Community support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      period: 'month',
      color: 'neon-magenta',
      icon: Crown,
      features: [
        'All Basic features',
        'AI-powered workout plans',
        'Personal nutrition guidance',
        'Advanced analytics',
        '1-on-1 coaching sessions',
        'Exclusive content library'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 39.99,
      period: 'month',
      color: 'neon-purple',
      icon: Sparkles,
      features: [
        'All Premium features',
        '24/7 personal trainer',
        'Custom meal plans',
        'Body composition analysis',
        'Recovery optimization',
        'Priority support',
        'Exclusive events access'
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'AI-Powered Training',
      description: 'Personalized workout plans that adapt to your progress and goals',
      color: 'neon-cyan'
    },
    {
      icon: Shield,
      title: 'Expert Guidance',
      description: 'Access to certified trainers and nutritionists for professional advice',
      color: 'neon-magenta'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with like-minded fitness enthusiasts and share your journey',
      color: 'neon-blue'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Earn badges and rewards as you reach your fitness milestones',
      color: 'neon-green'
    }
  ];

  const handleUpgrade = (planId) => {
    setSelectedPlan(planId);
    // Simulate upgrade process
    setTimeout(() => {
      updateUser({ membership: planId });
      setSelectedPlan(null);
    }, 2000);
  };

  const PlanCard = ({ plan, isCurrent }) => (
    <motion.div
      whileHover={{ y: -10 }}
      className={`cyber-card p-6 relative ${
        plan.popular ? 'border-2 border-neon-magenta glow-magenta' : 'border border-dark-border'
      } ${isCurrent ? 'bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-neon-magenta text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <div className="bg-neon-cyan text-white px-3 py-1 rounded-full text-xs font-semibold">
            Current Plan
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`w-16 h-16 bg-gradient-to-r from-${plan.color} to-${plan.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
          <plan.icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-orbitron font-bold text-white">${plan.price}</span>
          <span className="text-gray-400">/{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleUpgrade(plan.id)}
        disabled={isCurrent || selectedPlan === plan.id}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
          isCurrent
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : plan.popular
            ? 'bg-gradient-to-r from-neon-magenta to-pink-500 text-white hover:shadow-lg'
            : 'cyber-button'
        }`}
      >
        {selectedPlan === plan.id ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : isCurrent ? (
          <>
            <Check className="w-5 h-5" />
            <span>Current Plan</span>
          </>
        ) : (
          <>
            <span>{isCurrent ? 'Current Plan' : 'Upgrade Now'}</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-orbitron font-bold text-white flex items-center justify-center">
          <Crown className="w-8 h-8 text-neon-purple mr-3" />
          Membership Plans
        </h1>
        <p className="text-gray-400 mt-2">Choose the perfect plan for your fitness journey</p>
      </motion.div>

      {/* Current Membership Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="cyber-card p-6 text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Current Membership</h2>
            <p className="text-neon-cyan font-medium capitalize">{user?.membership || 'Basic'}</p>
          </div>
        </div>
        <p className="text-gray-400">
          You're currently on the {user?.membership || 'Basic'} plan. 
          {user?.membership !== 'elite' && ' Upgrade to unlock more features!'}
        </p>
      </motion.div>

      {/* Pricing Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={user?.membership === plan.id}
          />
        ))}
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="cyber-card p-6"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Why Choose CyberFit?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-4"
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-${benefit.color} to-${benefit.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="cyber-card p-6"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-b border-dark-border pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
            </div>
            <div className="border-b border-dark-border pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">We offer a 7-day free trial for all premium plans to help you get started.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-b border-dark-border pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards, PayPal, and Apple Pay for your convenience.</p>
            </div>
            <div className="border-b border-dark-border pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Can I change plans?</h3>
              <p className="text-gray-400">You can upgrade or downgrade your plan at any time from your account settings.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="cyber-card p-8 text-center bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border border-neon-cyan/30"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to Transform Your Fitness Journey?
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Join thousands of users who have already achieved their fitness goals with CyberFit. 
          Start your free trial today and experience the future of fitness.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cyber-button text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
        >
          <Sparkles className="w-6 h-6" />
          <span>Start Free Trial</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Membership; 