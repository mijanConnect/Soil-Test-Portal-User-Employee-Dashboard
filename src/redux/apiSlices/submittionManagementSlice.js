import { api } from "../api/baseApi";

export const submissionManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create document
    createDocument: builder.mutation({
      query: (formData) => ({
        method: "POST",
        url: "/document/upload",
        body: formData,
      }),
    }),

    // Get all documents
    getAllDocuments: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        method: "GET",
        url: "/document/upload",
        params: {
          page,
          limit,
          searchTerm: search,
        },
      }),
    }),

    // Get document for super admin and admin
    getSingleDocument: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/document/upload/${id}`,
      }),
    }),

    // Update document status
    updateDocumentStatus: builder.mutation({
      query: (data) => ({
        method: "PATCH",
        url: `/document/upload/${data.id}`,
        body: data,
      }),
    }),

    // Delete document
    deleteDocument: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/document/upload/${id}`,
      }),
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetSingleDocumentQuery,
  useUpdateDocumentStatusMutation,
  useDeleteDocumentMutation,
  useGetAllDocumentsQuery,
} = submissionManagementSlice;
