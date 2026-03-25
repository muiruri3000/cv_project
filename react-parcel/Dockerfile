# 1. Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# 2. Production stage
FROM nginx:alpine

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
