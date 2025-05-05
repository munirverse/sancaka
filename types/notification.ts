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

export interface NotificationData {
  id: number;
  name: string;
  type: NotificationType;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationApiResponse {
  message: string;
  data: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    list: NotificationData[];
  };
}

export interface NotificationPayload {
  name: string;
  type: NotificationType;
  details: object;
}
