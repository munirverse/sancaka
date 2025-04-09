import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DashboardOverview() {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Uptime</p>
            <p className="text-3xl font-bold">86.65%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Services Status</p>
            <p className="text-3xl font-bold">4/6</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Health Score</p>
            <Progress value={67} className="h-3 mt-2" />
            <p className="text-sm text-muted-foreground mt-1">67% healthy</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
