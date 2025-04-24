import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthPayload } from "@/types/auth";

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
  }),
});

export const { useSignUpMutation, useLoginMutation } = authApi;
