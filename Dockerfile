# Use official Node.js image as base
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y supervisor redis-server

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript project
RUN npm run build

# Copy the supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the application and Redis ports
EXPOSE 8000 6379

# Set the command to run Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
