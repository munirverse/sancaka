import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthPayload, AuthUpdatePayload } from "@/types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    signUp: builder.mutation<any, AuthPayload>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),
    login: builder.mutation<any, AuthPayload>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
    }),
    updateAccount: builder.mutation<any, AuthUpdatePayload>({
      async queryFn(payload, { getState }, _, baseQuery) {
        const token = (getState() as any).auth.token;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await baseQuery({
          url: "/auth",
          method: "PUT",
          body: payload,
          headers,
        });

        return response;
      },
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useUpdateAccountMutation,
  useLogoutMutation,
} = authApi;
