# Use official Node.js runtime
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# Optional: Run custom build step if needed
# RUN npm run build

# The environment variable SE_EPHE_PATH is set by your start script
ENV SE_EPHE_PATH=./data/ephe

# App will run on this port
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
