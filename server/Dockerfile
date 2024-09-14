# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port for the server (change 8000 if your server runs on a different port)
EXPOSE 8000

# Command to run the backend server
CMD ["npm", "start"]
