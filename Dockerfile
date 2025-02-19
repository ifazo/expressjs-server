# Use official Node.js image as base
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set the command to run the application
CMD ["node", "dist/index.js"]
