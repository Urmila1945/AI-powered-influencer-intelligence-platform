# Step 1: Build the React Application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set API URL for the Vite build step
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy built static files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx configuration to support React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
