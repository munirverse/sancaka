"use client";

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
import type { NotificationType } from "@/types/notification";
import { useAddNotificationMutation } from "@/lib/features/notification/notificationApi";

// Base schema for all notification types
const baseSchema = z.object({
  name: z.string().min(1, "Notification name is required"),
  type: z.enum(["telegram", "slack"] as const),
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

export function AddNotification() {
  const [addNotification] = useAddNotificationMutation();

  const [notificationType, setNotificationType] = useState<
    NotificationType | ""
  >("");

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      name: "",
      enabled: true,
    } as any,
  });

  const handleTypeChange = (value: NotificationType) => {
    setNotificationType(value);
    form.setValue("type", value);

    // Reset type-specific fields
    if (value === "telegram") {
      form.setValue("botToken", "");
      form.setValue("chatId", "");
    } else if (value === "slack") {
      form.setValue("webhookUrl", "");
      form.setValue("channelName", "");
    }
  };

  const onSubmit = async (data: NotificationFormValues) => {
    try {
      let details = {};

      if (data.type === "telegram") {
        details = {
          botToken: data.botToken,
          chatId: data.chatId,
        };
      } else if (data.type === "slack") {
        details = {
          webhookUrl: data.webhookUrl,
          channelName: data?.channelName,
        };
      }

      const notificationPayload = {
        name: data.name,
        type: data.type,
        details,
      };
      await addNotification(notificationPayload).catch((error) => {
        throw error;
      });
    } catch (error) {
      console.error("Error add notification:", error);
    }

    form.reset();
    setNotificationType("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-6">Add New Notification</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Critical Alerts" {...field} />
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
                      onValueChange={(value: NotificationType) => {
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Telegram specific fields */}
            {notificationType === "telegram" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="botToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Token</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                          {...field}
                        />
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
                        <Input placeholder="-1001234567890" {...field} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="webhookUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://hooks.slack.com/services/..."
                          {...field}
                        />
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
                        <Input placeholder="#monitoring-alerts" {...field} />
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

            <Button type="submit" disabled={!notificationType}>
              Add Notification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
