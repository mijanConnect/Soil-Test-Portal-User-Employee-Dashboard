import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import NotFound from "../NotFound";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetSuccess from "../Pages/Auth/ResetSuccess";
import SetPassword from "../Pages/Auth/SetPassword";
import SignUp from "../Pages/Auth/SignUp";

import SubmissionManagement from "../components/submissionManagement/SubmissionManagement";
import UploadDocument from "../components/uploadDocuments/UploadDocument";
import CategoryManagement from "../components/category/CategoryManagement";
import AboutUs from "../Pages/Dashboard/AboutUs";
import Contact from "../Pages/Dashboard/Contact";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndConditions from "../Pages/Dashboard/TermsAndCondition";
import FAQSection from "../components/faq/Faq";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import Notifications from "../Pages/Dashboard/Notifications";
import LoginCredentials from "../components/loginCredentials/LoginCredentials";

import PrivateRoute from "./ProtectedRoute";

// ✅ Utility to check login
const isLoggedIn = () => {
  return !!localStorage.getItem("token"); // or "user"
};

const router = createBrowserRouter([
  // Root path with redirect
  {
    path: "/",
    element: isLoggedIn() ? (
      <Navigate to="/submission-management" replace />
    ) : (
      <Navigate to="/auth/login" replace />
    ),
  },

  // Protected dashboard routes
  {
    path: "/",
    element: (
      <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/submission-management",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <SubmissionManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "/user-management",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE"]}>
            <LoginCredentials />
          </PrivateRoute>
        ),
      },
      {
        path: "/upload-documents",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <UploadDocument />
          </PrivateRoute>
        ),
      },
      {
        path: "/category-management",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE"]}>
            <CategoryManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "/about-us",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <AboutUs />
          </PrivateRoute>
        ),
      },
      {
        path: "/contact",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <Contact />
          </PrivateRoute>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <PrivacyPolicy />
          </PrivateRoute>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <TermsAndConditions />
          </PrivateRoute>
        ),
      },
      {
        path: "/faq",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <FAQSection />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <AdminProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/notification",
        element: (
          <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
            <Notifications />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Auth routes
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "/auth", element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      { path: "reset-success", element: <ResetSuccess /> },
      { path: "set-password", element: <SetPassword /> },
      { path: "signup", element: <SignUp /> },
    ],
  },

  // 404
  { path: "*", element: <NotFound /> },
]);

export default router;
