export interface Instance {
    id: string
    name: string
    url: string
    status: "Online" | "Offline"
    interval: string
    responseTime: string | null
    uptime: string
  }
  