"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatsResponse } from "@/types/stats";

interface DashboardOverviewProps {
  overview?: StatsResponse["data"]["overview"];
}

export function DashboardOverview({ overview }: DashboardOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Uptime</p>
            <p className="text-3xl font-bold">{overview?.uptime || 0}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Services Status
            </p>
            <p className="text-3xl font-bold">
              {overview?.serviceStatus?.active || 0}/
              {overview?.serviceStatus.all || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Health Score</p>
            <Progress value={overview?.healthScore || 0} className="h-3 mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {overview?.healthScore || 0}% healthy
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
