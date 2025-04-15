import { config } from "../../pubsub.config";
import { CheckInstanceQueueData } from "../../types/instance";
import Queue from "bull";
import type { JobStatus } from "bull";

export function publish(data: CheckInstanceQueueData) {
  console.log();

  const queue = new Queue("check-instance", config.redis.url!);

  queue.add({ instanceId: data.instanceId }, { delay: data.interval * 1000 });
}

export async function flushQueue(instanceId: string) {
  const jobTypes: JobStatus[] = ["waiting", "active", "completed", "failed"];
  const queue = new Queue("check-instance", config.redis.url!);

  for (const _ of jobTypes) {
    const jobs = await queue.getJobs(jobTypes);

    for (const job of jobs) {
      if (job.data.instanceId === instanceId) await job.remove();
      console.log(`Flushed job ${job.id} for instance ${instanceId}`);
    }
  }
}
