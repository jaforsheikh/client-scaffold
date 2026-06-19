import { NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }) =>
  [
    "rounded-button px-4 py-2 text-sm font-extrabold transition",
    isActive
      ? "bg-primary-tint text-primary"
      : "text-ink-muted hover:bg-primary-tint hover:text-primary",
  ].join(" ");

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface-page text-ink">
      <header className="sticky top-0 z-50 border-b border-surface-border bg-white/90 backdrop-blur-xl">
        <nav className="sc-container flex min-h-[76px] items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary text-white shadow-soft">
              <span className="material-symbols-rounded text-3xl">bloodtype</span>
            </span>

            <div>
              <p className="text-xl font-extrabold tracking-tight text-ink">
                Scaffold
              </p>
              <p className="-mt-1 text-xs font-bold text-ink-muted">
                Blood Donor Network
              </p>
            </div>
          </NavLink>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/donation-requests" className={navClass}>
              Donation Requests
            </NavLink>
            <NavLink to="/search" className={navClass}>
              Search Donors
            </NavLink>
          </div>

          <NavLink to="/login" className="sc-primary-btn px-5 py-2.5">
            <span className="material-symbols-rounded">login</span>
            Login
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-surface-border bg-ink text-white">
        <div className="sc-container grid gap-8 py-10 md:grid-cols-[1.3fr_.8fr_.8fr] md:py-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary text-white">
                <span className="material-symbols-rounded text-3xl">bloodtype</span>
              </span>

              <div>
                <p className="text-xl font-extrabold tracking-tight">
                  Scaffold
                </p>
                <p className="-mt-1 text-xs font-bold text-white/55">
                  A trusted blood donation platform
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm font-medium leading-6 text-white/65">
              Scaffold connects blood donors, requesters, volunteers and admins
              through a secure and responsive donation management experience.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em]">
              Platform
            </h3>

            <div className="mt-4 grid gap-3 text-sm font-bold text-white/65">
              <NavLink className="hover:text-white" to="/search">
                Search Donors
              </NavLink>
              <NavLink className="hover:text-white" to="/donation-requests">
                Donation Requests
              </NavLink>
              <NavLink className="hover:text-white" to="/funding">
                Funding
              </NavLink>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em]">
              Social
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-black transition hover:bg-primary"
                aria-label="Scaffold on X"
              >
                𝕏
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-primary"
                aria-label="Scaffold on Facebook"
              >
                <span className="material-symbols-rounded">public</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-primary"
                aria-label="Scaffold on LinkedIn"
              >
                <span className="material-symbols-rounded">business_center</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5">
          <p className="sc-container text-sm font-semibold text-white/50">
            © {new Date().getFullYear()} Scaffold. Built for humanity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;