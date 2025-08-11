#!/bin/bash

echo "🚀 Setting up CyberFit - Futuristic Fitness Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 22.17.1 or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="22.17.1"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "⚠️  Warning: You're using Node.js $NODE_VERSION. Recommended version is $REQUIRED_VERSION or later."
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
NODE_ENV=dev
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3333
DATABASE_URL="postgresql://username:password@localhost:5432/gym_api"
EOF
    echo "⚠️  Please update the .env file with your database credentials!"
fi

# Check if database is set up
echo "🗄️  Checking database setup..."
if command -v npx &> /dev/null; then
    echo "📊 Running database migrations..."
    npx prisma generate
    echo "⚠️  Please run 'npx prisma migrate dev' to set up your database"
else
    echo "❌ npx not found. Please install npm properly."
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your database credentials"
echo "2. Run: npx prisma migrate dev"
echo "3. Start the development servers: npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:3333"
echo ""
echo "Happy coding! 🚀💪"
