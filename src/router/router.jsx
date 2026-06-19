import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "../components/route/AdminRoute";
import PrivateRoute from "../components/route/PrivateRoute";
import VolunteerRoute from "../components/route/VolunteerRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AllBloodDonationRequests from "../pages/dashboard/AllBloodDonationRequests";
import AllUsers from "../pages/dashboard/AllUsers";
import CreateDonationRequest from "../pages/dashboard/CreateDonationRequest";
import DashboardHome from "../pages/dashboard/DashboardHome";
import MyDonationRequests from "../pages/dashboard/MyDonationRequests";
import Profile from "../pages/dashboard/Profile";
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
        element: (
          <PrivateRoute>
            <ComingSoon title="Donation Request Details" />
          </PrivateRoute>
        ),
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
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />,
      },
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-blood-donation-request",
        element: (
          <VolunteerRoute>
            <AllBloodDonationRequests />
          </VolunteerRoute>
        ),
      },
    ],
  },
]);

export default router;