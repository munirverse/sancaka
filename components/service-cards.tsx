"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, Wifi, WifiOff } from "lucide-react";

interface ServiceData {
  name: string;
  uptime: string;
  duration: string;
  responseTime: string;
  status: "Online" | "Offline";
  uptimeGraph: number[];
}

const services: ServiceData[] = [
  {
    name: "Main Website",
    uptime: "99.98%",
    duration: "43m",
    responseTime: "187 ms",
    status: "Online",
    uptimeGraph: Array(30).fill(1),
  },
  {
    name: "API Gateway",
    uptime: "99.95%",
    duration: "4h",
    responseTime: "210 ms",
    status: "Online",
    uptimeGraph: Array(30).fill(1),
  },
  {
    name: "Database Cluster",
    uptime: "99.99%",
    duration: "4h",
    responseTime: "45 ms",
    status: "Online",
    uptimeGraph: Array(30).fill(1),
  },
  {
    name: "Authentication Service",
    uptime: "70%",
    duration: "4h",
    responseTime: "1250 ms",
    status: "Offline",
    uptimeGraph: [...Array(25).fill(1), ...Array(5).fill(0)],
  },
  {
    name: "Payment Gateway",
    uptime: "50%",
    duration: "4h",
    responseTime: "320 ms",
    status: "Offline",
    uptimeGraph: [...Array(15).fill(1), ...Array(15).fill(0)],
  },
  {
    name: "Storage Service",
    uptime: "99.97%",
    duration: "43h",
    responseTime: "95 ms",
    status: "Online",
    uptimeGraph: Array(30).fill(1),
  },
];

export function ServiceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.name} service={service} />
      ))}
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceData }) {
  const isOnline = service.status === "Online";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold">{service.name}</h3>
          <div
            className={`p-2 rounded-md ${
              isOnline
                ? "bg-green-100 dark:bg-green-900"
                : "bg-red-100 dark:bg-red-900"
            }`}
          >
            {isOnline ? (
              <Wifi className={`h-4 w-4 text-green-500`} />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        <div className="mb-2">
          <p className="text-sm text-muted-foreground">Uptime</p>
          <div className="flex justify-between items-center">
            <p
              className={`font-semibold ${
                isOnline ? "text-green-500" : "text-red-500"
              }`}
            >
              {service.uptime}
            </p>
            <p className="text-sm text-muted-foreground">now</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 mb-4 h-2">
          {service.uptimeGraph.map((status, i) => (
            <div
              key={i}
              className={`h-2 w-full rounded-sm ${
                status ? "bg-green-500" : "bg-red-500"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">Response Time</p>
          </div>
          <p className="text-right font-medium">{service.responseTime}</p>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">Status</p>
          </div>
          <p
            className={`text-right font-medium ${
              isOnline ? "text-green-500" : "text-red-500"
            }`}
          >
            {service.status}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
