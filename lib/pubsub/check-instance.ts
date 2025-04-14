import { config } from "../../pubsub.config";
import { CheckInstanceQueueData } from "../../types/instance";
import Queue from "bull";

export function publish(data: CheckInstanceQueueData) {
  console.log();

  const queue = new Queue("check-instance", config.redis.url!);

  queue.add({ instanceId: data.instanceId }, { delay: data.interval * 1000 });
}
