import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import ComingSoon from "../pages/shared/ComingSoon";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ComingSoon title="Home Page" />,
      },
      {
        path: "donation-requests",
        element: <ComingSoon title="Donation Requests" />,
      },
      {
        path: "donation-requests/:id",
        element: <ComingSoon title="Donation Request Details" />,
      },
      {
        path: "search",
        element: <ComingSoon title="Search Donors" />,
      },
      {
        path: "login",
        element: <ComingSoon title="Login Page" />,
      },
      {
        path: "register",
        element: <ComingSoon title="Register Page" />,
      },
      {
        path: "funding",
        element: <ComingSoon title="Funding Page" />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <ComingSoon title="Dashboard Home" />,
      },
      {
        path: "profile",
        element: <ComingSoon title="Profile Page" />,
      },
      {
        path: "create-donation-request",
        element: <ComingSoon title="Create Donation Request" />,
      },
      {
        path: "my-donation-requests",
        element: <ComingSoon title="My Donation Requests" />,
      },
      {
        path: "all-users",
        element: <ComingSoon title="All Users" />,
      },
      {
        path: "all-blood-donation-request",
        element: <ComingSoon title="All Blood Donation Requests" />,
      },
    ],
  },
]);

export default router;