import { NavLink, Outlet } from "react-router-dom";

const dashboardLinks = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard", end: true },
  { label: "Profile", path: "/dashboard/profile", icon: "person" },
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
  { label: "All Users", path: "/dashboard/all-users", icon: "group" },
  {
    label: "All Requests",
    path: "/dashboard/all-blood-donation-request",
    icon: "assignment",
  },
];

const DashboardLayout = () => {
  const navClass = ({ isActive }) =>
    [
      "flex items-center gap-3 rounded-button px-4 py-3 text-sm font-extrabold transition",
      isActive
        ? "bg-primary text-white shadow-soft"
        : "text-white/65 hover:bg-white/10 hover:text-white",
    ].join(" ");

  return (
    <div className="min-h-screen bg-surface-page text-ink lg:grid lg:grid-cols-[290px_1fr]">
      <aside className="hidden min-h-screen bg-ink text-white lg:block">
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
        </div>

        <nav className="space-y-2 p-4">
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

            <NavLink to="/" className="sc-secondary-btn px-3">
              <span className="material-symbols-rounded">home</span>
            </NavLink>
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