import { Navigate, useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import useAuth from "../../hooks/useAuth";

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader label="Checking your dashboard permission..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(dbUser?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;