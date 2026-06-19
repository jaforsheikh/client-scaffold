import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import StatusBadge from "../components/common/StatusBadge";

const baseLinks = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard", end: true },
  { label: "Profile", path: "/dashboard/profile", icon: "person" },
];

const donorLinks = [
  {
    label: "Create Request",
    path: "/dashboard/create-donation-request",
    icon: "add_circle",
  },
  {
    label: "My Requests",
    path: "/dashboard/my-donation-requests",
    icon: "list_alt",
  },
];

const volunteerLinks = [
  {
    label: "All Requests",
    path: "/dashboard/all-blood-donation-request",
    icon: "assignment",
  },
];

const adminLinks = [
  { label: "All Users", path: "/dashboard/all-users", icon: "group" },
  {
    label: "All Requests",
    path: "/dashboard/all-blood-donation-request",
    icon: "assignment",
  },
];

const DashboardLayout = () => {
  const { dbUser, logoutUser } = useAuth();

  const role = dbUser?.role || "donor";
  const status = dbUser?.status || "active";

  const dashboardLinks =
    role === "admin"
      ? [...baseLinks, ...adminLinks]
      : role === "volunteer"
        ? [...baseLinks, ...volunteerLinks]
        : [...baseLinks, ...donorLinks];

  const navClass = ({ isActive }) =>
    [
      "flex items-center gap-3 rounded-button px-4 py-3 text-sm font-extrabold transition",
      isActive
        ? "bg-primary text-white shadow-soft"
        : "text-white/65 hover:bg-white/10 hover:text-white",
    ].join(" ");

  return (
    <div className="min-h-screen bg-surface-page text-ink lg:grid lg:grid-cols-[290px_1fr]">
      <aside className="hidden min-h-screen bg-ink text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 p-5">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary text-white">
              <span className="material-symbols-rounded text-3xl">
                bloodtype
              </span>
            </span>

            <div>
              <p className="text-xl font-extrabold tracking-tight">Scaffold</p>
              <p className="-mt-1 text-xs font-bold text-white/50">
                Dashboard Portal
              </p>
            </div>
          </NavLink>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold text-white/45">Signed in as</p>

            <h2 className="mt-1 truncate text-sm font-extrabold text-white">
              {dbUser?.name || "Scaffold User"}
            </h2>

            <p className="mt-1 truncate text-xs font-semibold text-white/50">
              {dbUser?.email || "user@scaffold.com"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={role} />
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {dashboardLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={navClass}
            >
              <span className="material-symbols-rounded">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logoutUser}
            className="flex w-full items-center gap-3 rounded-button px-4 py-3 text-sm font-extrabold text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-rounded">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-surface-border bg-white/90 backdrop-blur-xl lg:hidden">
          <div className="flex min-h-[70px] items-center justify-between px-4">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary text-white">
                <span className="material-symbols-rounded">bloodtype</span>
              </span>
              <span className="font-extrabold">Scaffold</span>
            </NavLink>

            <button
              type="button"
              onClick={logoutUser}
              className="sc-secondary-btn px-3"
            >
              <span className="material-symbols-rounded">logout</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-surface-border px-4 py-3">
            {dashboardLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  [
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition",
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white text-ink-muted hover:bg-primary-tint hover:text-primary",
                  ].join(" ")
                }
              >
                <span className="material-symbols-rounded text-base">
                  {link.icon}
                </span>
                {link.label}
              </NavLink>
            ))}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;