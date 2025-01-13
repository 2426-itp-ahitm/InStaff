
#!/bin/bash

echo "Starting the project in Sprint 3 state..."

# Backend server
echo "Starting backend server..."
cd backend/instaff-server || exit
mvn quarkus:dev &
BACKEND_PID=$!
echo "Backend server started with PID $BACKEND_PID"

# Docker
echo "Starting Docker containers..."
cd ../../db/docker-compose || exit
./start.sh
echo "Docker containers started."

# Web application
echo "Setting up web application..."
cd ../../web || exit
npm install
npm run build
npm start &
WEB_PID=$!
echo "Web application started with PID $WEB_PID"

echo "All services are running. Use the following commands to stop them:"
echo "kill $BACKEND_PID  # to stop backend"
echo "kill $WEB_PID      # to stop web application"

# Monitor for TypeScript changes
echo "Monitoring TypeScript changes. Press Ctrl+C to exit."
while true; do
  find . -name '*.ts' -type f -exec touch {} +
  npm run build
  sleep 5
done
