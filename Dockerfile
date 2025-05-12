
FROM node:alpine3.21

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .

RUN pnpm run build 

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["pnpm", "start"]

