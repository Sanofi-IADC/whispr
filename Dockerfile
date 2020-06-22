FROM node:12-alpine
COPY ./ /app
WORKDIR /app
RUN npm config set proxy $HTTP_PROXY
RUN npm config set https-proxy $HTTPS_PROXY
RUN npm install
RUN npm install -g typescript @nestjs/cli
RUN npm run build

FROM node:12-alpine
COPY --from=0 /app /app
WORKDIR /app
RUN npm config set proxy $HTTP_PROXY
RUN npm config set https-proxy $HTTPS_PROXY
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime", "--json", "pm2.config.js"]
