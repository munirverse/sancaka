FROM oven/bun:alpine 

WORKDIR /app

RUN echo "REDIS_URL=redis://redis:6379" > .env

# copy the pubsub config
COPY pubsub.config.ts .

# copy the subscriber code
ADD subscriber /app/subscriber

# install the dependencies
RUN bun install bull dotenv 

# run the subscriber
CMD ["bun", "./subscriber/index.ts"]


