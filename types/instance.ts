import type { Queue } from "bull";

export interface Instance {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline";
  interval: number | string;
  responseTime: string;
  uptime: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstanceResponse {
  message: string;
  data: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    list: Instance[];
  };
}

export interface CheckInstanceQueueData {
  instanceId: string;
  interval: number;
}
