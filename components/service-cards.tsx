"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatsResponse } from "@/types/stats";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { getIntervalFormat } from "@/lib/utils";

interface ServiceCardsProps {
  instances?: StatsResponse["data"]["instances"];
}

type ServiceData = StatsResponse["data"]["instances"][number];

export function ServiceCards({ instances: services }: ServiceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {services?.length
        ? services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))
        : null}
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceData }) {
  const isOnline = service.status === "online";

  const historyRoundColor = (historyNumber: number | null) => {
    if (historyNumber === null) return "bg-gray-200";
    return historyNumber ? "bg-green-500" : "bg-red-500";
  };

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
          <p className="text-sm text-muted-foreground">
            Uptime {`(${getIntervalFormat(service.interval)})`}
          </p>
          <div className="flex justify-between items-center">
            <p
              className={`font-semibold ${
                isOnline ? "text-green-500" : "text-red-500"
              }`}
            >
              {service.uptime}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 mb-4 h-2">
          {service.history.map((status, i) => (
            <div
              key={i}
              className={`h-2 w-full rounded-sm ${historyRoundColor(status)}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">Response Time</p>
          </div>
          <p className="text-right font-medium">{service.responsetime}</p>

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
