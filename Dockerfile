# 1. Start from an official Node.js lightweight environment
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy dependency definitions first (for faster building/caching)
COPY package*.json ./

# 4. Install production dependencies inside the container
RUN npm install

# 5. Copy the rest of your application code into the container
COPY . .

# 6. Document which port the container listens on
EXPOSE 3000

# 7. Specify the default command to start the application
CMD ["node", "server_crud.js"]