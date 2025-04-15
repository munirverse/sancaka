import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { instances, instanceStatusHistory } from "@/lib/db/schema";
import { count, sum, eq } from "drizzle-orm";

export async function GET() {
  try {
    const overview = {
      uptime: 0,
      serviceStatus: {
        active: 0,
        all: 0,
      },
      healthScore: 0,
    };

    const [{ count: totalInstances }] = await db
      .select({ count: count() })
      .from(instances);

    const [{ sum: totalUptime }] = await db
      .select({ sum: sum(instances.uptime) })
      .from(instances);

    const [{ count: totalOnlineInstances }] = await db
      .select({ count: count() })
      .from(instances)
      .where(eq(instances.status, "online"));

    overview.uptime = totalUptime
      ? parseFloat((parseFloat(totalUptime) / totalInstances).toFixed(2))
      : 0.0;

    overview.serviceStatus.active = totalOnlineInstances;
    overview.serviceStatus.all = totalInstances;

    overview.healthScore = parseFloat(
      ((totalOnlineInstances / totalInstances) * 100).toFixed(2)
    );

    const response = {
      message: "Stats fetched successfully",
      data: {
        overview,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
