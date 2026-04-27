FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install   
COPY . .  
RUN npm run build            

WORKDIR /app        
ENV VITE_DISABLE_WATCHER=true

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
