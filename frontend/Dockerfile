# Stage 1: build angular app (optional if you want to build in container)
# FROM node:18-alpine as build
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build --prod

# Stage 2: serve with nginx
FROM nginx:alpine
COPY ./dist/frontend/browser /usr/share/nginx/html

# Optionally copy custom nginx config if you want to configure routing
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
