"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Instance } from "@/types/instance";

interface EditInstanceModalProps {
  instance: Instance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedInstance: Instance) => void;
}

export function EditInstanceModal({
  instance,
  open,
  onOpenChange,
  onSave,
}: EditInstanceModalProps) {
  const [formData, setFormData] = useState<Partial<Instance>>({
    name: "",
    url: "",
    interval: 1,
  });

  // Update form data when instance changes
  useEffect(() => {
    if (instance) {
      setFormData({
        id: instance.id,
        name: instance.name,
        url: instance.url,
        status: instance.status,
        interval: instance.interval,
        responseTime: instance.responseTime,
        uptime: instance.uptime,
      });
    }
  }, [instance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instance && formData.name && formData.url && formData.interval) {
      onSave({
        ...instance,
        name: formData.name,
        url: formData.url,
        interval: formData.interval,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Monitoring Instance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <label htmlFor="edit-name" className="text-sm font-medium">
              Instance Name
            </label>
            <Input
              id="edit-name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label htmlFor="edit-url" className="text-sm font-medium">
              URL
            </label>
            <Input
              id="edit-url"
              value={formData.url || ""}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label htmlFor="edit-interval" className="text-sm font-medium">
              Check Interval
            </label>
            <Select
              value={formData.interval?.toString() || "1"}
              onValueChange={(value) =>
                setFormData({ ...formData, interval: parseInt(value) })
              }
            >
              <SelectTrigger id="edit-interval">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every 1 minute</SelectItem>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="10">Every 10 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every 1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
