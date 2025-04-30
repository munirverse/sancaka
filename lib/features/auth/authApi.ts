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
      query: (payload) => ({
        url: "/auth",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const { useSignUpMutation, useLoginMutation, useUpdateAccountMutation } =
  authApi;
