import { config } from "../../pubsub.config";
import { CheckInstanceQueueData } from "../../types/instance";
import Queue from "bull";

export function publish(data: CheckInstanceQueueData) {
  console.log();

  const queue = new Queue("check-instance", config.redis.url!);

  data.jobs = queue;

  queue.add(data, { delay: data.interval * 1000 });
}
