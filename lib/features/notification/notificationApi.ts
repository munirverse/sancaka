import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NotificationApiResponse } from "@/types/notification";

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
    addNotification: builder.mutation<any, any>({
      query: (notification) => ({
        url: "/notifications",
        method: "POST",
        body: notification,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useAddNotificationMutation } =
  notificationApi;
