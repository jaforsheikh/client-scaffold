import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "../components/route/AdminRoute";
import PrivateRoute from "../components/route/PrivateRoute";
import VolunteerRoute from "../components/route/VolunteerRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AllBloodDonationRequests from "../pages/dashboard/AllBloodDonationRequests";
import AllUsers from "../pages/dashboard/AllUsers";
import CreateDonationRequest from "../pages/dashboard/CreateDonationRequest";
import DashboardHome from "../pages/dashboard/DashboardHome";
import MyDonationRequests from "../pages/dashboard/MyDonationRequests";
import Profile from "../pages/dashboard/Profile";
import DonationRequestDetails from "../pages/public/DonationRequestDetails";
import DonationRequests from "../pages/public/DonationRequests";
import Funding from "../pages/public/Funding";
import Home from "../pages/public/Home";
import Search from "../pages/public/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
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