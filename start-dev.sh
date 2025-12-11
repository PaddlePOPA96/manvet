#!/bin/bash

# Start Laravel backend
echo "🚀 Starting Laravel backend..."
cd backend-laravel && php artisan serve &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start React/Vue frontend
echo "🚀 Starting frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "📦 Backend PID: $BACKEND_PID"
echo "🎨 Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
