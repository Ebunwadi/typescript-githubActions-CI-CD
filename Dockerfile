FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
ENV PORT 5000
EXPOSE $PORT
RUN npm run build
CMD ["node", "dist/server.js"]