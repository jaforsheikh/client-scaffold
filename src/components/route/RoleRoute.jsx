import { Navigate } from "react-router-dom";
import Loader from "../common/Loader";
import useAuth from "../../hooks/useAuth";

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { loading, dbUser } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!allowedRoles.includes(dbUser?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;