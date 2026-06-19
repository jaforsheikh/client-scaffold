import { useState } from "react";
import toast from "react-hot-toast";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import confirmModal from "../../utils/confirmModal";

const initialUsers = [
  {
    id: "USR-1001",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    bloodGroup: "A+",
    district: "Dhaka",
    upazila: "Dhanmondi",
    role: "donor",
    status: "active",
  },
  {
    id: "USR-1002",
    name: "Mehedi Hasan",
    email: "mehedi@example.com",
    bloodGroup: "O-",
    district: "Chattogram",
    upazila: "Panchlaish",
    role: "volunteer",
    status: "active",
  },
  {
    id: "USR-1003",
    name: "Sadia Rahman",
    email: "sadia@example.com",
    bloodGroup: "B+",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    role: "donor",
    status: "blocked",
  },
  {
    id: "USR-1004",
    name: "Admin User",
    email: "admin@scaffold.com",
    bloodGroup: "AB+",
    district: "Dhaka",
    upazila: "Gulshan",
    role: "admin",
    status: "active",
  },
];

const AllUsers = () => {
  const [users, setUsers] = useState(initialUsers);

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

    toast.success("User role updated successfully.");
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

    toast.success("User status updated successfully.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Manage platform users"
        description="Review donors, volunteers and admins. Update roles or block/unblock users from a secure admin table."
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

      <section className="sc-card overflow-hidden">
        <div className="border-b border-surface-border p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                User List
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Admin can manage role and account status from here.
              </p>
            </div>

            <StatusBadge status="admin" label="Admin Access" />
          </div>
        </div>

        {users.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon="group_off"
              title="No users found"
              description="No registered user data is available yet."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <th>User</th>
                  <th>Blood</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Admin Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-surface-border">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-tint text-primary">
                          <span className="material-symbols-rounded">
                            person
                          </span>
                        </div>

                        <div>
                          <p className="font-extrabold text-ink">
                            {user.name}
                          </p>
                          <p className="text-xs font-semibold text-ink-muted">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <BloodBadge group={user.bloodGroup} size="sm" />
                    </td>

                    <td>
                      <p className="font-bold text-ink">{user.district}</p>
                      <p className="text-xs font-semibold text-ink-muted">
                        {user.upazila}
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
                        <Button
                          size="sm"
                          variant="secondary"
                          icon="volunteer_activism"
                          disabled={user.role === "volunteer"}
                          onClick={() => handleRoleChange(user.id, "volunteer")}
                        >
                          Volunteer
                        </Button>

                        <Button
                          size="sm"
                          variant="dark"
                          icon="admin_panel_settings"
                          disabled={user.role === "admin"}
                          onClick={() => handleRoleChange(user.id, "admin")}
                        >
                          Admin
                        </Button>

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