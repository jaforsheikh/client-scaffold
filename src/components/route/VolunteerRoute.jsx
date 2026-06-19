import RoleRoute from "./RoleRoute";

const VolunteerRoute = ({ children }) => {
  return (
    <RoleRoute allowedRoles={["volunteer", "admin"]}>{children}</RoleRoute>
  );
};

export default VolunteerRoute;