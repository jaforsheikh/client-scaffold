import { Navigate } from "react-router-dom";
import Loader from "../common/Loader";
import useAuth from "../../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;