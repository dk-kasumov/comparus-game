FROM node:18.19.0-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 1: serve app with nginx server
FROM nginx:latest
COPY --from=build /app/dist/comparus-game/browser  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
