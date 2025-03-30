FROM node:22.14.0 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY .env ./

# Install app dependencies
RUN apt-get install g++ && yarn global add @nestjs/cli && yarn install --production

COPY apps ./apps
COPY graphql ./graphql
COPY libs ./libs

RUN yarn run build

FROM node:22.14.0

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/graphql ./graphql
COPY --from=builder /app/.env ./.env

EXPOSE 3000
CMD ["node", "./dist/apps/backend/main"]
