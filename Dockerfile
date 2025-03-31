FROM node:22.14.0 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

# Install app dependencies
RUN apt-get update && apt-get install -y g++ && yarn global add @nestjs/cli && yarn install

COPY apps ./apps
COPY graphql ./graphql
COPY libs ./libs

RUN yarn run build

FROM node:22.14.0

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/graphql ./graphql

EXPOSE 3000
CMD ["node", "dist/apps/backend/main.js"]
