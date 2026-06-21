import { Navigate } from "react-router-dom";
import Loader from "../common/Loader";
import useAuth from "../../hooks/useAuth";

const VolunteerRoute = ({ children }) => {
  const { loading, isAdmin, isVolunteer } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAdmin && !isVolunteer) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default VolunteerRoute;