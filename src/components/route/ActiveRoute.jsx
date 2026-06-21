import Loader from "../common/Loader";
import useAuth from "../../hooks/useAuth";

const ActiveRoute = ({ children }) => {
  const { loading, isBlocked } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (isBlocked) {
    return (
      <section className="bg-surface-page py-12">
        <div className="sc-container">
          <div className="sc-card mx-auto max-w-2xl p-8 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-red-50 text-state-danger">
              <span className="material-symbols-rounded text-4xl">block</span>
            </span>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
              Account Blocked
            </h1>

            <p className="mt-3 text-base font-semibold leading-7 text-ink-muted">
              Your account is currently blocked. You cannot create donation
              requests until an admin changes your status to active.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return children;
};

export default ActiveRoute;