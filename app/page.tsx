"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/dashboard-overview";
import { ServiceCards } from "@/components/service-cards";
import { AddMonitoringInstance } from "@/components/add-monitoring-instance";
import { MonitoringInstancesTable } from "@/components/monitoring-instances-table";
import { ModeToggle } from "@/components/mode-toggle";
import { useGetStatsQuery } from "@/lib/features/stats/statsHook";
import { AccountNavigation } from "@/components/account-navigation";
import { useAuthSelector } from "@/lib/features/auth/authHook";
import { AddNotification } from "@/components/add-notification";

export default function DashboardPage() {
  const { data: stats } = useGetStatsQuery("", {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  const { isAuthenticated } = useAuthSelector();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Sancaka</h1>
          <ModeToggle />
        </div>
      </header>
      <AccountNavigation />
      <main className="container py-1">
        <Tabs defaultValue="uptime">
          <TabsList className="mb-4 bg-muted/50">
            <TabsTrigger value="uptime">Uptime</TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="instances">Instances</TabsTrigger>
            )}
            {isAuthenticated && (
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="uptime" className="space-y-6">
            <DashboardOverview overview={stats?.overview} />
            <ServiceCards instances={stats?.instances} />
          </TabsContent>
          {isAuthenticated && (
            <TabsContent value="instances" className="space-y-6">
              <AddMonitoringInstance />
              <MonitoringInstancesTable />
            </TabsContent>
          )}
          {isAuthenticated && (
            <TabsContent value="notifications" className="space-y-6">
              <AddNotification />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
