import { api } from "../api/baseApi";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/verify-email",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forgot-password",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ token, ...data }) => {
        return {
          method: "POST",
          url: "/auth/reset-password",
          body: data,
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        };
      },
    }),
    resendOtp: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/resend-otp",
          body: data,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
        };
      },
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/user",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    profile: builder.query({
      query: () => ({
        method: "GET",
        url: "/user/profile",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
  useResendOtpMutation,
} = authSlice;
