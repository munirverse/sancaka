export type NotificationType = "telegram" | "slack";

export interface BaseNotification {
  id: string;
  name: string;
  type: NotificationType;
  createdAt: string;
  enabled: boolean;
}

export interface TelegramNotification extends BaseNotification {
  type: "telegram";
  botToken: string;
  chatId: string;
}

export interface SlackNotification extends BaseNotification {
  type: "slack";
  webhookUrl: string;
  channel?: string;
}

export type Notification = TelegramNotification | SlackNotification;
