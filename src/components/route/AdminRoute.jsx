import RoleRoute from "./RoleRoute";

const AdminRoute = ({ children }) => {
  return <RoleRoute allowedRoles={["admin"]}>{children}</RoleRoute>;
};

export default AdminRoute;