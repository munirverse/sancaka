"use client";

import { useEffect, useState } from "react";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { NotificationData } from "@/types/notification";
import { useUpdateNotificationMutation } from "@/lib/features/notification/notificationHook";

// Base schema for all notification types
const baseSchema = z.object({
  name: z.string().min(1, "Notification name is required"),
  type: z.enum(["telegram", "slack", "whatsapp", "email", "webhook"] as const),
  enabled: z.boolean().default(true),
});

// Type-specific schemas
const telegramSchema = baseSchema.extend({
  type: z.literal("telegram"),
  botToken: z.string().min(1, "Bot token is required"),
  chatId: z.string().min(1, "Chat ID is required"),
});

const slackSchema = baseSchema.extend({
  type: z.literal("slack"),
  webhookUrl: z.string().url("Must be a valid URL"),
  channelName: z.string().optional(),
});

// Combined schema with discriminated union
const notificationSchema = z.discriminatedUnion("type", [
  telegramSchema,
  slackSchema,
]);

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface EditNotificationModalProps {
  notification: NotificationData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNotificationModal({
  notification,
  open,
  onOpenChange,
}: EditNotificationModalProps) {
  const [notificationType, setNotificationType] = useState<string>("");

  const [updateNotification] = useUpdateNotificationMutation();

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      name: "",
      enabled: true,
    } as any,
  });

  const handleTypeChange = (value: string) => {
    setNotificationType(value);
    form.setValue("type", value as any);

    // Reset type-specific fields
    if (value === "telegram") {
      form.setValue("botToken", "");
      form.setValue("chatId", "");
    } else if (value === "slack") {
      form.setValue("webhookUrl", "");
      form.setValue("channelName", "");
    }
  };

  // Update form when notification changes
  useEffect(() => {
    if (notification) {
      // Reset form with notification values
      const resetValues: any = {
        name: notification.name,
        type: notification.type,
      };

      if (notification.type === "telegram") {
        resetValues.botToken = (notification.details as any).botToken;
        resetValues.chatId = (notification.details as any).chatId;
      } else if (notification.type === "slack") {
        resetValues.webhookUrl = (notification.details as any).webhookUrl;
        resetValues.channelName = (notification.details as any).channelName;
      }

      form.reset(resetValues as any);

      // Set the notification type
      setNotificationType(notification.type);
    }
  }, [notification, form]);

  const onSubmit = async (data: NotificationFormValues) => {
    try {
      const id = notification?.id;

      const payload = {
        name: data.name,
        type: data.type,
        details: {},
      };

      if (data.type === "telegram") {
        payload.details = {
          botToken: data.botToken,
          chatId: data.chatId,
        };
      } else if (data.type === "slack") {
        payload.details = {
          webhookUrl: data.webhookUrl,
          channelName: data.channelName,
        };
      }

      if (id) {
        await updateNotification({ id, data: payload }).catch((error) => {
          throw error;
        });
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }

    onOpenChange(false);
  };

  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Notification</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTypeChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select notification type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="slack">Slack</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Telegram specific fields */}
            {notificationType === "telegram" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="botToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Token</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The token provided by BotFather when you created your
                        bot
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chatId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chat ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The ID of the chat where messages will be sent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Slack specific fields */}
            {notificationType === "slack" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="webhookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The webhook URL for your Slack workspace
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        The channel where messages will be sent (if different
                        from webhook default)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
