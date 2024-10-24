# Dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app

# Install Yarn 4.2.2
RUN corepack enable && corepack prepare yarn@4.2.2 --activate

# Copy package.json, yarn.lock, .yarnrc.yml, .swcrc, etc.
COPY package.json yarn.lock .yarnrc.yml ./

# Copy the Yarn directory to use its cache
COPY .yarn ./.yarn

# Install dependencies using Yarn 4
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the required ports
EXPOSE 8080 8081 8083 8085

# Start the application
CMD ["yarn", "start", "--sources", "packages/esm-*-app/"]