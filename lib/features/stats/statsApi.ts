import { StatsResponse } from "@/types/stats";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Stats"],
  endpoints: (builder) => ({
    getStats: builder.query<StatsResponse["data"], string>({
      query: () => {
        return {
          url: `/stats`,
          method: "GET",
        };
      },
      providesTags: ["Stats"],
      transformResponse: (response: StatsResponse) => response.data,
    }),
  }),
});

export const { useGetStatsQuery } = statsApi;
