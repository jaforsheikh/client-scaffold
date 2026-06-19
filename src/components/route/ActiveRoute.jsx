import { Link, Navigate, useLocation } from "react-router-dom";
import Button from "../common/Button";
import Loader from "../common/Loader";
import StatusBadge from "../common/StatusBadge";
import useAuth from "../../hooks/useAuth";

const ActiveRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader label="Checking your account status..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (dbUser?.status === "blocked") {
    return (
      <div className="space-y-6">
        <div className="sc-card mx-auto max-w-2xl p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-red-50 text-state-danger">
            <span className="material-symbols-rounded text-4xl">block</span>
          </div>

          <div className="mt-5">
            <StatusBadge status="blocked" />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
            Account blocked
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-ink-muted">
            Your account is currently blocked. You cannot create a blood
            donation request until an admin changes your account status to
            active.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard">
              <Button variant="secondary" icon="dashboard">
                Dashboard
              </Button>
            </Link>

            <Link to="/dashboard/profile">
              <Button icon="person">View Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ActiveRoute;