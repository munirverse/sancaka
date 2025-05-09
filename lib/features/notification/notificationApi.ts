import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  NotificationApiResponse,
  NotificationPayload,
} from "@/types/notification";
import type { RootState } from "@/lib/store";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  tagTypes: ["Notifications"],
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
    updateNotification: builder.mutation<
      any,
      { id: number; data: NotificationPayload }
    >({
      query: ({ id, data }) => ({
        url: `/notifications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useAddNotificationMutation,
  useDeleteNotificationMutation,
  useUpdateNotificationMutation,
} = notificationApi;
