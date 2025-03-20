// RTK QUERY
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/" }),
  endpoints: (builder) => ({
    // user endpoints
    signUp: builder.mutation({
      query: (data) => ({
        url: "users/auth/register/",
        method: "POST",
        body: data,
      }),
    }),
    logIn: builder.mutation({
      query: (data) => ({
        url: "users/auth/login/",
        method: "POST",
        body: data,
      }),
    }),
    OTP: builder.mutation({
      query: (data) => ({
        url: "/auth",
        method: "POST",
        body: data,
      }),
    }),
    OTPVerification: builder.mutation({
      query: (data) => ({
        url: "/auth",
        method: "POST",
        body: data,
      }),
    }),

    // auction endpoints
    createAuction: builder.mutation({
      query: (data) => ({
        url: `/auctions/create/`,
        method: "POST",
        body: data,
      }),
    }),
    getAuctions: builder.mutation({
      query: () => ({
        url: "/auctions",
        method: "GET",
        // body: data,
      }),
    }),
    getAuction: builder.mutation({
      query: (auctId) => ({
        url: `/auctions/${auctId}/`,
        method: "GET",
        // body: data,
      }),
    }),
    bidAuction: builder.mutation({
      query: (auctId) => ({
        url: `/auctions/${auctId}/bid/`,
        method: "PATCH",
        // body: data,
      }),
    }),
    deleteAuction: builder.mutation({
      query: (auctId) => ({
        url: `/auctions/${auctId}/delete/`,
        method: "DELETE",
        // body: data,
      }),
    }),
    updateAuction: builder.mutation({
      query: (auctId) => ({
        url: `/auctions/${auctId}/update/`,
        method: "PUT",
        // body: data,
      }),
    }),
  }),
});
