# syntax=docker/dockerfile:1

FROM node:16 as base

WORKDIR /app
COPY package*.json ./
EXPOSE 5000

FROM base as test
ENV NODE_ENV=test
RUN npm ci
COPY . .
RUN ["npm", "run", "test"]

FROM base as production
ENV NODE_ENV=production
RUN npm ci --only=production
COPY . .
CMD ["npm", "run", "start"]

FROM base as development
ENV NODE_ENV=development
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev:debug"]