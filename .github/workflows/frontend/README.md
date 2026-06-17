# CyberFit - Futuristic Fitness App

A modern, futuristic fitness application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Futuristic UI/UX**: Cyberpunk-inspired design with neon colors and modern animations
- **TypeScript**: Full TypeScript implementation for better type safety and developer experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Complete auth system with context API
- **Real-time Data**: Live charts and progress tracking
- **AI Integration**: AI-powered workout recommendations
- **Modern Animations**: Smooth transitions with Framer Motion

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React + React Icons
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Code Quality**: ESLint + Prettier

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GYM_API/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🎯 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   └── ui/            # UI components
├── contexts/           # React contexts
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── assets/            # Static assets
├── App.tsx            # Main app component
├── index.tsx          # Entry point
└── index.css          # Global styles
```

## 🔧 TypeScript Migration

The project has been successfully migrated from JavaScript to TypeScript with the following improvements:

### ✅ Completed
- [x] TypeScript configuration (`tsconfig.json`)
- [x] Type definitions (`src/types/index.ts`)
- [x] AuthContext with proper typing
- [x] App component with TypeScript
- [x] Layout components (Navbar, Sidebar)
- [x] Dashboard page
- [x] Login page
- [x] ESLint configuration for TypeScript
- [x] Prettier configuration
- [x] Package.json scripts

### 🔄 In Progress
- [ ] Remaining pages (Signup, WorkoutPlanner, ActivityTracker, Membership, AITrainer)
- [ ] Component optimization
- [ ] Performance improvements

## 🎨 Design System

### Colors
- **Primary**: Neon Cyan (`#00ffff`)
- **Secondary**: Neon Magenta (`#ff00ff`)
- **Accent**: Neon Blue (`#0080ff`)
- **Background**: Dark (`#0a0a0a`)
- **Cards**: Dark Card (`#1a1a1a`)

### Typography
- **Font Family**: Orbitron (for headings), Inter (for body)
- **Weights**: 400, 500, 600, 700, 900

### Components
- **Cyber Cards**: Futuristic card components with neon borders
- **Cyber Buttons**: Animated buttons with hover effects
- **Neon Text**: Glowing text effects
- **Grid Background**: Cyberpunk grid pattern

## 🔐 Authentication

The app uses a context-based authentication system with:
- Login/Signup functionality
- Protected routes
- User session management
- Mock API integration (ready for backend connection)

## 📊 Data Visualization

Charts and analytics powered by Recharts:
- Weekly progress tracking
- Body composition analysis
- Workout statistics
- Real-time data updates

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for better performance
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: Optimized assets and lazy loading

## 🔧 Development

### Code Quality
- **ESLint**: TypeScript-aware linting
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Husky**: Git hooks for code quality

### Best Practices
- **Component Structure**: Functional components with hooks
- **Type Safety**: Strict TypeScript configuration
- **Performance**: Optimized re-renders and bundle size
- **Accessibility**: ARIA labels and keyboard navigation

## 🌟 Future Enhancements

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Offline support (PWA)
- [ ] Advanced analytics
- [ ] Social features
- [ ] AI workout recommendations
- [ ] Mobile app (React Native)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ and TypeScript** 