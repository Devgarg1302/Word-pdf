# Step 1: Use an official Node.js image as the base
FROM node:18-slim

# Step 2: Install LibreOffice Converter dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    && rm -rf /var/lib/apt/lists/*

# Step 3: Set working directory in the container
WORKDIR /app

# Step 4: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 5: Install Node.js dependencies
RUN npm install

# Step 6: Copy the rest of the application code
COPY . .

# Step 7: Expose the port your app runs on (if it's a web app, for example)
EXPOSE 3000

# Step 8: Run the Node.js application
CMD ["node", "app.js"]
