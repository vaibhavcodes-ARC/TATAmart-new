FROM node:20-alpine

WORKDIR /app

# Copy package manifest
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start application
CMD ["npm", "run", "dev"]
