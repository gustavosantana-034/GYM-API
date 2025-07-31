# CyberFit - Futuristic Fitness App

A cutting-edge, AI-powered fitness application built with React, featuring a futuristic cyberpunk design with neon accents, holographic elements, and smooth animations.

## 🚀 Features

### Core Functionality
- **Interactive Dashboard** - Real-time fitness metrics with animated charts
- **Workout Planner** - Calendar-based workout scheduling with customizable routines
- **Activity Tracker** - Real-time session logging with heart rate and calorie monitoring
- **AI Personal Trainer** - Intelligent chatbot for fitness guidance and motivation
- **Membership Management** - Tiered subscription plans with premium features
- **Authentication System** - Secure login/signup with social integration

### Design Features
- **Futuristic UI** - Dark mode with neon cyan, magenta, and electric blue accents
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Cyberpunk Aesthetics** - Holographic elements, glowing effects, and bold typography
- **Modern Icons** - Lucide React icons for consistent visual language

### Technical Stack
- **React 18** - Latest React features with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework with custom futuristic theme
- **Framer Motion** - Advanced animations and page transitions
- **React Router** - Client-side routing with protected routes
- **Recharts** - Interactive data visualization for fitness metrics
- **Context API** - State management for authentication and user data

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd futuristic-fitness-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Navbar.js          # Main navigation bar
│       └── Sidebar.js         # Side navigation menu
├── contexts/
│   └── AuthContext.js         # Authentication state management
├── pages/
│   ├── Dashboard.js           # Main dashboard with charts
│   ├── WorkoutPlanner.js      # Calendar-based workout planning
│   ├── ActivityTracker.js     # Real-time activity monitoring
│   ├── Membership.js          # Subscription management
│   ├── AITrainer.js           # AI chatbot interface
│   ├── Login.js               # Authentication login
│   └── Signup.js              # User registration
├── App.js                     # Main app component with routing
├── index.js                   # App entry point
└── index.css                  # Global styles and Tailwind imports
```

## 🎨 Design System

### Color Palette
- **Primary**: Neon Cyan (#00ffff)
- **Secondary**: Neon Magenta (#ff00ff)
- **Accent**: Electric Blue (#0080ff)
- **Success**: Neon Green (#00ff41)
- **Background**: Dark (#0a0a0a, #1a1a1a)
- **Borders**: Dark Gray (#2a2a2a)

### Typography
- **Headings**: Orbitron (futuristic, bold)
- **Body**: Rajdhani (clean, modern)
- **Monospace**: For technical elements

### Components
- **Cyber Cards** - Glassmorphism cards with neon borders
- **Neon Buttons** - Glowing interactive elements
- **Holographic Backgrounds** - Animated gradient effects
- **Glow Effects** - CSS shadows for depth and emphasis

## 🔧 Customization

### Adding New Pages
1. Create a new component in the `pages/` directory
2. Add the route to `App.js`
3. Include the navigation item in `Sidebar.js`

### Styling Modifications
- Edit `tailwind.config.js` for theme customization
- Modify `src/index.css` for global styles
- Use the existing CSS classes for consistency

### Adding Features
- Extend the AuthContext for additional user data
- Create new context providers for feature-specific state
- Follow the existing component patterns for consistency

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🔐 Environment Variables

Create a `.env` file for environment-specific configuration:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_AI_SERVICE_KEY=your_ai_service_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Recharts** for data visualization
- **Google Fonts** for typography

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]
- Documentation: [link-to-docs]

---

**Built with ❤️ and ⚡ for the future of fitness** 