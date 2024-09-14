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

# Expose the port for the app (adjust based on your environment, e.g., React typically runs on 3000, backend on 8000)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
