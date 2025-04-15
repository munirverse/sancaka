"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetStatsQuery } from "@/lib/features/stats/statsHook";

export function DashboardOverview() {
  const { data } = useGetStatsQuery("");

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Uptime</p>
            <p className="text-3xl font-bold">{data?.overview.uptime}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Services Status
            </p>
            <p className="text-3xl font-bold">
              {data?.overview.serviceStatus.active}/
              {data?.overview.serviceStatus.all}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Health Score</p>
            <Progress value={data?.overview.healthScore} className="h-3 mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {data?.overview.healthScore}% healthy
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
