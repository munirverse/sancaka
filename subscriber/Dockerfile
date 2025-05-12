FROM oven/bun:alpine 

WORKDIR /app

# copy env files
COPY .env . 

# copy the pubsub config
COPY pubsub.config.ts .

# copy the subscriber code
ADD subscriber /app/subscriber

# copy dependency code
ADD lib /app/lib

# install the dependencies
RUN bun install bull dotenv drizzle-orm pg  clsx  tailwind-merge jose 

# run the subscriber
CMD ["bun", "./subscriber/index.ts"]


