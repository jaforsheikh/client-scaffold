import { Link } from "react-router-dom";

const ComingSoon = ({ title = "Page coming soon", description }) => {
  return (
    <section className="sc-container py-10 sm:py-16">
      <div className="sc-card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
          <span className="material-symbols-rounded text-4xl">
            construction
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-base font-medium leading-7 text-ink-muted">
          {description ||
            "This route is ready. We will add the full production UI step by step."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="sc-secondary-btn">
            <span className="material-symbols-rounded">home</span>
            Home
          </Link>

          <Link to="/dashboard" className="sc-primary-btn">
            <span className="material-symbols-rounded">dashboard</span>
            Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;