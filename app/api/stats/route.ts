import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { instances } from "@/lib/db/schema";
import { count, sum, eq, sql } from "drizzle-orm";

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

    const instanceWithGroupHistory = await db.execute(sql`
     SELECT
        instances.id,
        instances.name,
        instances.status,
        instances.uptime,
        instances.response_time AS responseTime,
        JSON_AGG(
          CASE WHEN h.online IS NOT false THEN 1 ELSE 0 END ORDER BY h.created_at DESC
        ) AS history
      FROM instances
      LEFT JOIN LATERAL (
        SELECT *
        FROM instance_status_history
        WHERE instance_status_history.instance_id = instances.id
        ORDER BY instance_status_history.created_at DESC
        LIMIT 20
      ) h ON true
      GROUP BY instances.id
      ORDER BY instances.created_at DESC;
    `);

    const response = {
      message: "Stats fetched successfully",
      data: {
        overview,
        instances: instanceWithGroupHistory.rows || [],
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
