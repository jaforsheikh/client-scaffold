import { Navigate, useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader label="Checking your secure session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;