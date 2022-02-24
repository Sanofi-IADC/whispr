ARG NODE_VERSION=16.14.0

########################
# Builder stage
#
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

# App build dependencies
# This step is done before copying and building the app source code
#  to benefit from Docker layer caching if the dependencies have not changed
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci --quiet

# Copy source code and build
COPY ./ ./
RUN npm run build

########################
# Final image
#
FROM node:${NODE_VERSION}-alpine
WORKDIR /app

# Runtime dependencies
RUN npm install -g pm2

# App runtime dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci --quiet --only=production

# Add the Instana APM layer
COPY --from=instana/aws-fargate-nodejs /instana /instana
RUN /instana/setup.sh
ENV NODE_OPTIONS="--require /instana/node_modules/@instana/aws-fargate"

# Build artifacts
COPY --from=builder /app/pm2.config.js ./pm2.config.js
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "pm2-runtime", "--json", "pm2.config.js" ]
