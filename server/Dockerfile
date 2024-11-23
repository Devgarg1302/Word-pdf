# Use the pre-built linuxserver/libreoffice image
FROM linuxserver/libreoffice:latest

# Set up the working directory for your app
WORKDIR /app

# Install Node.js and npm
RUN apk add --no-cache \
    nodejs \
    npm

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of your application files into the container
COPY . .

# Expose the port your app will be running on
EXPOSE 3000

# Set the start command for the application
CMD ["node", "app.js"]
