# 🏋️‍♂️ CyberFit - Futuristic Fitness Platform

A full-featured fitness platform with a futuristic design, featuring user authentication, gym management, check-ins with location validation, and daily usage tracking.

## 🚀 Features

### Backend (Fastify + TypeScript)
- **User Authentication**: JWT-based authentication with refresh tokens
- **Gym Management**: Create, search, and find nearby gyms
- **Check-in System**: Location-based check-ins with validation
- **Metrics**: Track check-in history and statistics
- **Role-based Access**: Admin and user roles
- **Database**: PostgreSQL with Prisma ORM

### Frontend (React + TypeScript)
- **Futuristic UI**: Cyberpunk-inspired design with neon colors
- **Real-time Tracking**: Live workout session monitoring
- **Gym Check-ins**: Location-based gym check-in system
- **Interactive Charts**: Real-time fitness metrics visualization
- **Responsive Design**: Works on all devices
- **Dark Theme**: Eye-friendly dark interface

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 22.17.1
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Testing**: Vitest
- **Validation**: Zod

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

### Prerequisites
- Node.js 22.17.1
- PostgreSQL database
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/gustavosantana-034/GYM-API.git
   cd GYM-API
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=dev
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3333
   DATABASE_URL="postgresql://username:password@localhost:5432/gym_api"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

This will start:
- Backend on: http://localhost:3333
- Frontend on: http://localhost:3000

## 🎯 API Endpoints

### Authentication
- `POST /users` - Register new user
- `POST /sessions` - Login
- `PATCH /token/refresh` - Refresh JWT token
- `GET /me` - Get user profile

### Gyms
- `GET /gyms/search?q=query` - Search gyms
- `GET /gyms/nearby?latitude=X&longitude=Y` - Find nearby gyms
- `POST /gyms` - Create gym (Admin only)

### Check-ins
- `POST /gyms/:gymId/check-ins` - Create check-in
- `GET /check-ins/history` - Get check-in history
- `GET /check-ins/metrics` - Get check-in metrics
- `PATCH /check-ins/:checkInId/validate` - Validate check-in (Admin only)

## 🎨 Frontend Features

### Pages
- **Dashboard**: Overview of fitness metrics
- **Activity Tracker**: Real-time workout tracking and gym check-ins
- **Workout Planner**: Plan and schedule workouts
- **Membership**: Manage subscription plans
- **AI Trainer**: AI-powered workout recommendations

### Components
- **Loading Spinner**: Futuristic loading animations
- **Notifications**: Toast notifications for user feedback
- **Charts**: Real-time fitness data visualization
- **Cyber Cards**: Styled containers with neon effects

## 🔧 Development

### Backend Development
```bash
# Start backend in development mode
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Start frontend in development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Management
```bash
# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 🧪 Testing

### Backend Tests
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with UI
npm run test:ui
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the project: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the project: `cd frontend && npm run build`
2. Deploy the `build` folder to your preferred platform

## 📱 Mobile Support

The frontend is fully responsive and works great on mobile devices. The gym check-in feature uses the device's GPS for location validation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Gustavo Santana**
- GitHub: [@gustavosantana-034](https://github.com/gustavosantana-034)
- Project: [GYM-API](https://github.com/gustavosantana-034/GYM-API)

## 🙏 Acknowledgments

- Fastify team for the excellent framework
- Prisma team for the amazing ORM
- React team for the frontend framework
- All contributors and supporters

---

**Ready to start your futuristic fitness journey?** 🚀💪
