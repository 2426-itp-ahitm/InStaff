# How to run the project in the Sprint 3 state

# backend server
* cd backend/instaff-server
* mvn quarkus:dev


# Docker (Demon has to run)
* cd db/docker-compose
* ./start.sh

# web
* cd web
* npm install
* npm run build
* npm start

# after every .ts change
* npm run build