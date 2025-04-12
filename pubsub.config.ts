import "dotenv/config";

export const config = {
  redis: {
    url: process.env.REDIS_URL,
  },
  db: {
    url: process.env.POSTGRES_URL,
  },
  topic: ["check-instance"],
};
