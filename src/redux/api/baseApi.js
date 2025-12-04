import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.agritecint.com/api/v1",
    // baseUrl: "http://10.10.7.44/api/v1",
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

export const imageUrl = "https://api.agritecint.com";
// export const imageUrl = "http://10.10.7.44";
