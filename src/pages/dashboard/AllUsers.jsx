import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { DEFAULT_AVATAR } from "../../utils/constants";
import confirmModal from "../../utils/confirmModal";

const initialUsers = [
  {
    id: "USR-1001",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    avatar: DEFAULT_AVATAR,
    role: "donor",
    status: "active",
  },
  {
    id: "USR-1002",
    name: "Mehedi Hasan",
    email: "mehedi@example.com",
    avatar: DEFAULT_AVATAR,
    role: "volunteer",
    status: "active",
  },
  {
    id: "USR-1003",
    name: "Sadia Rahman",
    email: "sadia@example.com",
    avatar: DEFAULT_AVATAR,
    role: "donor",
    status: "blocked",
  },
  {
    id: "USR-1004",
    name: "Admin User",
    email: "admin@scaffold.com",
    avatar: DEFAULT_AVATAR,
    role: "admin",
    status: "active",
  },
];

const statusFilters = ["all", "active", "blocked"];

const AllUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    if (activeFilter === "all") return users;

    return users.filter((user) => user.status === activeFilter);
  }, [activeFilter, users]);

  const handleRoleChange = async (userId, role) => {
    const confirmed = await confirmModal({
      title: "Change user role?",
      text: `This user role will be updated to ${role}.`,
      confirmButtonText: "Yes, update",
      icon: "question",
    });

    if (!confirmed) return;

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, role } : user
      )
    );

    toast.success(`User role updated to ${role}.`);
  };

  const handleStatusChange = async (userId, status) => {
    const confirmed = await confirmModal({
      title: "Change user status?",
      text: `This user status will be updated to ${status}.`,
      confirmButtonText: "Yes, update",
      icon: "warning",
    });

    if (!confirmed) return;

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, status } : user
      )
    );

    toast.success(`User status updated to ${status}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Manage all platform users"
        description="Filter users by account status and manage user role or access from one admin table."
        icon="group"
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Users" value={users.length} icon="group" />
        <SummaryCard
          label="Active Users"
          value={users.filter((user) => user.status === "active").length}
          icon="verified"
        />
        <SummaryCard
          label="Blocked Users"
          value={users.filter((user) => user.status === "blocked").length}
          icon="block"
        />
      </section>

      <section className="sc-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Filter Users
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Filter user list by active or blocked status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={activeFilter === status ? "primary" : "secondary"}
                onClick={() => setActiveFilter(status)}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="sc-card overflow-hidden">
        <div className="border-b border-surface-border p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                User Management Table
              </h2>

              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Showing {filteredUsers.length} user account
                {filteredUsers.length === 1 ? "" : "s"}.
              </p>
            </div>

            <StatusBadge status="admin" label="Admin Access" />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon="group_off"
              title="No users found"
              description="No user matched your selected status filter."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <th>Avatar</th>
                  <th>User Email</th>
                  <th>User Name</th>
                  <th>User Role</th>
                  <th>User Status</th>
                  <th className="text-right">Admin Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-surface-border">
                    <td>
                      <img
                        src={user.avatar || DEFAULT_AVATAR}
                        alt={user.name}
                        className="h-12 w-12 rounded-[18px] object-cover shadow-sm"
                      />
                    </td>

                    <td>
                      <p className="text-sm font-semibold text-ink-muted">
                        {user.email}
                      </p>
                    </td>

                    <td>
                      <p className="font-extrabold text-ink">{user.name}</p>
                      <p className="text-xs font-semibold text-ink-muted">
                        ID: {user.id}
                      </p>
                    </td>

                    <td>
                      <StatusBadge status={user.role} />
                    </td>

                    <td>
                      <StatusBadge status={user.status} />
                    </td>

                    <td>
                      <div className="flex flex-wrap justify-end gap-2">
                        {user.status === "active" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            icon="block"
                            onClick={() =>
                              handleStatusChange(user.id, "blocked")
                            }
                          >
                            Block
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="success"
                            icon="verified"
                            onClick={() =>
                              handleStatusChange(user.id, "active")
                            }
                          >
                            Unblock
                          </Button>
                        )}

                        {user.role === "donor" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            icon="volunteer_activism"
                            onClick={() =>
                              handleRoleChange(user.id, "volunteer")
                            }
                          >
                            Make Volunteer
                          </Button>
                        ) : null}

                        {user.role !== "admin" ? (
                          <Button
                            size="sm"
                            variant="dark"
                            icon="admin_panel_settings"
                            onClick={() => handleRoleChange(user.id, "admin")}
                          >
                            Make Admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            icon="admin_panel_settings"
                            disabled
                          >
                            Admin
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value, icon }) => {
  return (
    <div className="sc-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-ink-muted">{label}</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary-tint text-primary">
          <span className="material-symbols-rounded text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;