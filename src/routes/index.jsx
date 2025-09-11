import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import NotFound from "../NotFound";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetSuccess from "../Pages/Auth/ResetSuccess";
import SetPassword from "../Pages/Auth/SetPassword";

// Dashboard pages & components
import CustomerManagement from "../components/customerManagement/customerManagement";
import TierSystem from "../components/TierSystem/TierSystem";
import SubscriptionTable from "../components/subscriber/SubscriberTable";
import PromotionManagement from "../components/promotionManagement/PromotionManagement";
import SalesRepPortal from "../components/salesRepPortal/SalesRepPortal";
import AuditLogs from "../components/auditLogs/AuditLogs";
import LoginCredentials from "../components/loginCredentials/LoginCredentials";
import ReportingAnalytics from "../components/reportingAnalytics/ReportingAnalytics";
import PushNotifications from "../components/pushNotifications/PushNotifications";
import OrderManagementContainer from "../components/orderMangement/OrderManagementContainer";
import SalesManagement from "../Pages/Dashboard/SalesManagement";
import Retailer from "../Pages/Dashboard/Retailer";
import ViewSalesReps from "../components/SalesRepsManagement/detailsSalesReps/ViewSalesReps";
import LoyaltyProgram from "../Pages/Dashboard/LoyaltyProgram";
import CategoryManagement from "../components/category/CategoryManagement";
import ColorManagement from "../components/colorManage/ColorManagement";
import SizeManagement from "../components/sizeManagement/SizeManagement";
import ProductManagement from "../components/productManagement/ProductsManagement";
import UserManagement from "../components/userMangement/UserManagement";
import PackagesPlans from "../Pages/Dashboard/Subscription";
import Banner from "../Pages/Dashboard/Banner";
import AboutUs from "../Pages/Dashboard/AboutUs";
import Contact from "../Pages/Dashboard/Contact";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndConditions from "../Pages/Dashboard/TermsAndCondition";
import FAQSection from "../components/faq/Faq";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import Notifications from "../Pages/Dashboard/Notifications";

// Sales reps
import SaleRepsManagement from "../Pages/Dashboard/SaleRepsManagement";

import PrivateRoute from "./ProtectedRoute";
import SubmissionManagement from "../components/submissionManagement/SubmissionManagement";
import UploadDocument from "../components/uploadDocuments/UploadDocument";
import SignUp from "../Pages/Auth/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute allowedRoles={["EMPLOYEE", "USER"]}>
        <Main />
      </PrivateRoute>
    ),
    children: [
      // Dashboard home
      {
        path: "/",
        element: <Navigate to="/submission-management" replace />,
      },
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

  // ====== AUTH ======
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

  // ====== 404 ======
  { path: "*", element: <NotFound /> },
]);

export default router;
