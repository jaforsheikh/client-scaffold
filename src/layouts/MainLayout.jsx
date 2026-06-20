import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { DEFAULT_AVATAR } from "../utils/constants";

const navClass = ({ isActive }) =>
  [
    "rounded-button px-4 py-2 text-sm font-extrabold transition",
    isActive
      ? "bg-primary-tint text-primary"
      : "text-ink-muted hover:bg-primary-tint hover:text-primary",
  ].join(" ");

const MainLayout = () => {
  const { user, dbUser, logoutUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const avatar = dbUser?.avatar || user?.photoURL || DEFAULT_AVATAR;
  const name = dbUser?.name || user?.displayName || "Scaffold User";
  const email = dbUser?.email || user?.email || "";

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logoutUser();
  };

  return (
    <div className="min-h-screen bg-surface-page text-ink">
      <header className="sticky top-0 z-50 border-b border-surface-border bg-white/90 backdrop-blur-xl">
        <nav className="sc-container flex min-h-[76px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary text-white shadow-soft">
              <span className="material-symbols-rounded text-3xl">
                bloodtype
              </span>
            </span>

            <div>
              <p className="text-xl font-extrabold tracking-tight text-ink">
                Scaffold
              </p>
              <p className="-mt-1 text-xs font-bold text-ink-muted">
                Blood Donor Organization
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>

            <NavLink to="/donation-requests" className={navClass}>
              Donation Requests
            </NavLink>

            <NavLink to="/search" className={navClass}>
              Search Donors
            </NavLink>

            {user ? (
              <NavLink to="/funding" className={navClass}>
                Funding
              </NavLink>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <NavLink to="/login" className="sc-primary-btn px-5 py-2.5">
                <span className="material-symbols-rounded">login</span>
                Login
              </NavLink>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((current) => !current)}
                  className="flex items-center gap-3 rounded-[18px] border border-surface-border bg-white px-3 py-2 shadow-sm transition hover:border-primary/30 hover:bg-primary-tint"
                >
                  <img
                    src={avatar}
                    alt={name}
                    className="h-10 w-10 rounded-[14px] object-cover"
                  />

                  <span className="hidden text-left sm:block">
                    <span className="block max-w-[150px] truncate text-sm font-extrabold text-ink">
                      {name}
                    </span>
                    <span className="block max-w-[150px] truncate text-xs font-semibold text-ink-muted">
                      {email}
                    </span>
                  </span>

                  <span className="material-symbols-rounded text-ink-muted">
                    expand_more
                  </span>
                </button>

                {isDropdownOpen ? (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-[24px] border border-surface-border bg-white shadow-card">
                    <div className="border-b border-surface-border p-4">
                      <p className="truncate text-sm font-extrabold text-ink">
                        {name}
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold text-ink-muted">
                        {email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm font-extrabold text-ink-muted transition hover:bg-primary-tint hover:text-primary"
                      >
                        <span className="material-symbols-rounded">
                          dashboard
                        </span>
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left text-sm font-extrabold text-ink-muted transition hover:bg-red-50 hover:text-state-danger"
                      >
                        <span className="material-symbols-rounded">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </nav>

        <div className="border-t border-surface-border px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>

            <NavLink to="/donation-requests" className={navClass}>
              Donation Requests
            </NavLink>

            <NavLink to="/search" className={navClass}>
              Search Donors
            </NavLink>

            {user ? (
              <NavLink to="/funding" className={navClass}>
                Funding
              </NavLink>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-surface-border bg-ink text-white">
        <div className="sc-container grid gap-8 py-10 md:grid-cols-[1.3fr_.8fr_.8fr] md:py-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary text-white">
                <span className="material-symbols-rounded text-3xl">
                  bloodtype
                </span>
              </span>

              <div>
                <p className="text-xl font-extrabold tracking-tight">
                  Scaffold
                </p>
                <p className="-mt-1 text-xs font-bold text-white/55">
                  A trusted blood donor organization
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm font-medium leading-6 text-white/65">
              Scaffold connects blood donors, requesters, volunteers and admins
              through a secure and responsive blood donation management
              experience.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em]">
              Platform
            </h3>

            <div className="mt-4 grid gap-3 text-sm font-bold text-white/65">
              <Link className="hover:text-white" to="/">
                Home
              </Link>
              <Link className="hover:text-white" to="/donation-requests">
                Donation Requests
              </Link>
              <Link className="hover:text-white" to="/search">
                Search Donors
              </Link>
              <Link className="hover:text-white" to="/funding">
                Funding
              </Link>
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
                <span className="material-symbols-rounded">
                  business_center
                </span>
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
