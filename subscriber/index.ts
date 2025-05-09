import Queue, { Job } from "bull";
import { config } from "../pubsub.config";
import type { CheckInstanceQueueData } from "@/types/instance";
import { db } from "@/lib/db";
import {
  instances,
  instanceStatusHistory,
  notifications,
} from "@/lib/db/schema";
import { eq, count, and } from "drizzle-orm";
import { sendTelegramMessage, sendSlackMessage } from "@/lib/utils";

const checkInstanceProcessing = async (job: Job) => {
  const instance = job.data as CheckInstanceQueueData;

  const [existingInstance] = await db
    .select()
    .from(instances)
    .leftJoin(notifications, eq(instances.notificationId, notifications.id))
    .where(eq(instances.id, parseInt(instance.instanceId)));

  if (!existingInstance) {
    console.log(
      "Skipping instance",
      "with id",
      instance.instanceId,
      "because it does not exist"
    );

    return;
  }

  let status: "offline" | "online" = "offline";

  try {
    const response = await fetch(`${existingInstance.instances.url}`).catch(
      (error) => {
        throw error;
      }
    );

    if (response.status === 200 && response.ok) {
      status = "online";
    } else {
      throw new Error("Instance is offline");
    }
  } catch (error) {
    if (existingInstance.notifications?.type === "telegram") {
      // send notification to telegram
      await sendTelegramMessage(
        existingInstance.instances.name,
        (existingInstance.notifications?.details as any)?.botToken,
        (existingInstance.notifications?.details as any)?.chatId
      );
    } else if (existingInstance.notifications?.type === "slack") {
      // send notification to slack
      await sendSlackMessage(
        existingInstance.instances.name,
        (existingInstance.notifications?.details as any)?.webhookUrl
      );
    }
  }

  await db.insert(instanceStatusHistory).values({
    instanceId: parseInt(instance.instanceId),
    online: status === "online",
  });

  const [{ count: onlineHistoryCount }] = await db
    .select({ count: count() })
    .from(instanceStatusHistory)
    .where(
      and(
        eq(instanceStatusHistory.instanceId, parseInt(instance.instanceId)),
        eq(instanceStatusHistory.online, true)
      )
    );

  const [{ count: totalHistoryCount }] = await db
    .select({ count: count() })
    .from(instanceStatusHistory)
    .where(eq(instanceStatusHistory.instanceId, parseInt(instance.instanceId)));

  const uptime = ((onlineHistoryCount / totalHistoryCount) * 100).toFixed(2);

  await db
    .update(instances)
    .set({ uptime, status, updatedAt: new Date() })
    .where(eq(instances.id, parseInt(instance.instanceId)));

  console.log(
    "Updated instance",
    existingInstance.instances.name,
    "with id",
    instance.instanceId,
    "to",
    status
  );

  // republish the instance to the queue
  job.queue.add(
    { instanceId: instance.instanceId },
    { delay: existingInstance.instances.interval * 1000 }
  );
};

const main = async () => {
  console.log("Starting subscriber at ", new Date().toISOString());

  if (!config.redis.url) {
    throw new Error("Redis URL is not set");
  }

  for (const topic of config.topic) {
    if (topic === "check-instance") {
      const queue = new Queue(topic, config.redis.url);

      queue.process(checkInstanceProcessing);
    }
  }

  setTimeout(() => main(), 1000);
};

main();
