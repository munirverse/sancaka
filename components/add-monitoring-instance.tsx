"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuccessAddInstanceModal } from "@/components/success-add-instance-modal";
import { useAddInstanceMutation } from "@/lib/features/instance/instanceHook";

export function AddMonitoringInstance() {
  const [instanceName, setInstanceName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState("300");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [addedInstance, setAddedInstance] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [addInstance, { error }] = useAddInstanceMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    try {
      await addInstance({
        name: instanceName,
        url,
        interval,
      });

      if (error) {
        console.error("Error creating instance:", error);
      }

      // Open success modal
      setSuccessModalOpen(true);
      setAddedInstance({
        name: instanceName,
        url,
      });
    } catch (error) {
      console.error("Error creating instance:", error);
    }
    // Reset form
    setInstanceName("");
    setUrl("");
    setInterval("300");
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6">
            Add New Monitoring Instance
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="instance-name"
                  className="block text-sm font-medium mb-2"
                >
                  Instance Name
                </label>
                <Input
                  id="instance-name"
                  placeholder="My Service"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium mb-2">
                  URL
                </label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="check-interval"
                  className="block text-sm font-medium mb-2"
                >
                  Check Interval
                </label>
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger id="check-interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Every 10 seconds</SelectItem>
                    <SelectItem value="15">Every 15 seconds</SelectItem>
                    <SelectItem value="30">Every 30 seconds</SelectItem>
                    <SelectItem value="60">Every 1 minute</SelectItem>
                    <SelectItem value="300">Every 5 minutes</SelectItem>
                    <SelectItem value="600">Every 10 minutes</SelectItem>
                    <SelectItem value="900">Every 15 minutes</SelectItem>
                    <SelectItem value="1800">Every 30 minutes</SelectItem>
                    <SelectItem value="3600">Every 1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Add Instance
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <SuccessAddInstanceModal
        instance={addedInstance}
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
      />
    </>
  );
}
