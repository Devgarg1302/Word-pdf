# Backend Dockerfile
FROM node:18

RUN apt-get update && apt-get install -y libreoffice

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the backend port
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
