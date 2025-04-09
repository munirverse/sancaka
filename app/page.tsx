import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "@/components/dashboard-overview"
import { ServiceCards } from "@/components/service-cards"
import { AddMonitoringInstance } from "@/components/add-monitoring-instance"
import { MonitoringInstancesTable } from "@/components/monitoring-instances-table"
import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Sancaka</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="container py-6">
        <Tabs defaultValue="uptime">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="uptime">Uptime</TabsTrigger>
            <TabsTrigger value="instances">Instances</TabsTrigger>
          </TabsList>
          <TabsContent value="uptime" className="space-y-6">
            <DashboardOverview />
            <ServiceCards />
          </TabsContent>
          <TabsContent value="instances" className="space-y-6">
            <AddMonitoringInstance />
            <MonitoringInstancesTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
