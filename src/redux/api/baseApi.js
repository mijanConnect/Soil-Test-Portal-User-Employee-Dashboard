import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://146.190.126.8:5001/api/v1",
    prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem("accessToken");
      const token = new URLSearchParams(location.search).get("token");
      if (token) {
        headers.set("Authorization", `${token}`);
        return headers;
      }
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
    tagTypes: ["Submissions", "Auth"],
  }),
  endpoints: () => ({}),
});

export const imageUrl = "http://146.190.126.8:5001";
