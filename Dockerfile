# Build stage
FROM node:18-alpine as builder

# Install system dependencies
RUN apk add --no-cache git python3 make g++

# Set working directory
# WORKDIR /app
WORKDIR /usr/src/app

# Copy package files for yarn workspaces
COPY package.json yarn.lock ./
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Build using OpenMRS tooling
RUN yarn openmrs build


# Production stage
FROM nginx:alpine as prod

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Stage 2: Production
FROM node:18-alpine3.16
WORKDIR /usr/src/app
RUN yarn global add serve
COPY --from=builder /usr/src/app/dist /usr/src/app/dist
# COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
# COPY --from=builder /usr/src/app/webpack.config.js /usr/src/app/webpack.config.js
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]


