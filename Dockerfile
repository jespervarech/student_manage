# Stage 1: Build the application
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies (use npm ci for faster, more reliable installs in CI/CD)
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the project (production build)
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built application to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html



