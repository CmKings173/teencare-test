# Stage 1: Build Vite React
FROM node:22-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Replace default nginx config if needed for React Router (SPA)
RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
