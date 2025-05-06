import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  NotificationApiResponse,
  NotificationPayload,
} from "@/types/notification";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  tagTypes: ["Notifications"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationApiResponse["data"], string>({
      query: (params) => ({
        url: `/notifications?${params}`,
        method: "GET",
      }),
      providesTags: ["Notifications"],
      transformResponse: (response: NotificationApiResponse) => response.data,
    }),
    addNotification: builder.mutation<NotificationPayload, NotificationPayload>(
      {
        query: (notification) => ({
          url: "/notifications",
          method: "POST",
          body: notification,
        }),
        invalidatesTags: ["Notifications"],
      }
    ),
    deleteNotification: builder.mutation<any, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useAddNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
