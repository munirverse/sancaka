import { Instance, InstanceResponse } from "@/types/instance";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const instanceApi = createApi({
  reducerPath: "instanceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Instances"],
  endpoints: (builder) => ({
    getInstances: builder.query<InstanceResponse["data"], string>({
      query: (params) => {
        return {
          url: `/instances?${params}`,
          method: "GET",
        };
      },
      providesTags: ["Instances"],
      transformResponse: (response: InstanceResponse) => response.data,
    }),
    addInstance: builder.mutation<Partial<Instance>, Partial<Instance>>({
      query: (instance) => ({
        url: "/instances",
        method: "POST",
        body: instance,
      }),
      invalidatesTags: ["Instances"],
    }),
    updateInstance: builder.mutation<Partial<Instance>, Partial<Instance>>({
      query: (instance) => ({
        url: `/instances/${instance.id}`,
        method: "PUT",
        body: instance,
      }),
      invalidatesTags: ["Instances"],
    }),
    deleteInstance: builder.mutation<Partial<Instance>, Partial<Instance>>({
      query: (instance) => ({
        url: `/instances/${instance.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Instances"],
    }),
  }),
});

export const {
  useGetInstancesQuery,
  useAddInstanceMutation,
  useUpdateInstanceMutation,
  useDeleteInstanceMutation,
} = instanceApi;
