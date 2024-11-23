# Use an official Debian-based Node.js image
FROM node:16-bullseye

# Update and install LibreOffice along with its dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-dejavu-core \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory for the application
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files
COPY . .

# Expose the port your application will use
EXPOSE 3000

# Start the Node.js application
CMD ["node", "app.js"]
