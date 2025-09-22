import { api } from "../api/baseApi";

const categorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: ({ page, limit, search }) => {
        return {
          url: "/category",
          method: "GET",
          params: {
            page,
            limit,
            searchTerm: search,
          },
        };
      },
    }),
  }),
});

export const { useGetAllCategoryQuery } = categorySlice;
