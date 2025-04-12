import Queue from "bull";
import { config } from "../pubsub.config";

const main = async () => {
  console.log("Starting subscriber at ", new Date().toISOString());

  if (!config.redis.url) {
    throw new Error("Redis URL is not set");
  }

  for (const topic of config.topic) {
    const queue = new Queue(topic, config.redis.url);

    queue.process(async (job) => {
      console.log(job.data);
    });
  }

  setTimeout(() => main(), 1000);
};

main();
