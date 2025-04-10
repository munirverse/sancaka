export interface Instance {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline";
  interval: number;
  responseTime: string;
  uptime: string;
  createdAt: string;
  updatedAt: string;
}
