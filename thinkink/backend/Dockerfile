# Minimal backend image for learning
# 1) Use a lightweight Node base image
FROM node:20-alpine

# 2) Set work directory inside the container
WORKDIR /app

# 3) Copy only dependency manifests first (leverages Docker layer cache)
COPY package*.json ./

# 4) Prevent Puppeteer from downloading Chromium during install (optional)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 5) Install production dependencies
RUN npm ci --omit=dev

# 6) Copy the rest of the source code
COPY . .

# 7) Expose the port your Express server listens on
EXPOSE 5000

# 8) Start the server
CMD ["node", "server.js"]


