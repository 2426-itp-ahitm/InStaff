# Stage 1: Build Angular app
FROM node:24-alpine as build
WORKDIR /app
COPY . .
# Drop any copied node_modules and the (Windows-generated) lockfile so npm
# re-resolves platform-specific optional native deps (e.g. lightningcss arm64-musl)
# for the target architecture. Fixes "Cannot find module '../lightningcss.linux-arm64-musl.node'".
RUN rm -rf node_modules package-lock.json \
    && npm install \
    && npm run build -- --configuration production

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
