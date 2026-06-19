import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const NotFound = () => {
  return (
    <section className="min-h-[calc(100vh-76px)] bg-surface-page py-14 sm:py-20">
      <div className="sc-container">
        <div className="sc-card mx-auto max-w-3xl overflow-hidden p-8 text-center sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-primary-tint text-primary">
            <span className="material-symbols-rounded text-5xl">
              travel_explore
            </span>
          </div>

          <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.22em] text-primary">
            404 Error
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-ink-muted">
            The page you are trying to visit does not exist or may have been
            moved. Please go back to the home page or dashboard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button icon="home" size="lg">
                Back Home
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button icon="dashboard" size="lg" variant="secondary">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;