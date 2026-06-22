import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { DEFAULT_AVATAR, USER_STATUS_OPTIONS } from "../../utils/constants";

const USERS_PER_PAGE = 10;

const filterOptions = [{ label: "All", value: "" }, ...USER_STATUS_OPTIONS];

const roleOptions = [
  { label: "Make Volunteer", value: "volunteer", icon: "diversity_3" },
  { label: "Make Admin", value: "admin", icon: "admin_panel_settings" },
];

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async (page = 1, status = statusFilter) => {
    setLoading(true);

    try {
      const { data } = await axiosPublic.get("/api/users", {
        params: {
          page,
          limit: USERS_PER_PAGE,
          status: status || undefined,
        },
      });

      setUsers(data?.users || []);
      setTotalUsers(data?.total || 0);
      setTotalPages(data?.totalPages || 0);
      setCurrentPage(data?.page || page);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load users."
      );

      setUsers([]);
      setTotalUsers(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const getUserId = (user) => user.id || user._id;

  const handleStatusUpdate = async (targetUser, status) => {
    const userId = getUserId(targetUser);

    const confirmResult = await Swal.fire({
      title: status === "blocked" ? "Block this user?" : "Unblock this user?",
      text:
        status === "blocked"
          ? "Blocked users cannot create donation requests."
          : "This user will be able to create donation requests again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#C1121F",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axiosPublic.patch(`/api/users/${userId}/status`, { status });

      toast.success(`User status updated to ${status}.`);
      setOpenMenuId(null);
      await loadUsers(currentPage, statusFilter);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update user status."
      );
    }
  };

  const handleRoleUpdate = async (targetUser, role) => {
    const userId = getUserId(targetUser);

    const confirmResult = await Swal.fire({
      title: `Make ${targetUser.name || targetUser.email} ${role}?`,
      text: `This user role will be updated to ${role}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#C1121F",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axiosPublic.patch(`/api/users/${userId}/role`, { role });

      toast.success(`User role updated to ${role}.`);
      setOpenMenuId(null);
      await loadUsers(currentPage, statusFilter);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update user role."
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <section className="space-y-8">
      <div className="sc-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">group</span>
            </span>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Admin Users
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Manage all users
              </h1>

              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
                Admin can block, unblock, make volunteer, and make admin from
                this user management table.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-surface-border bg-white px-6 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-muted">
              Total Users
            </p>
            <p className="mt-1 text-3xl font-extrabold text-primary">
              {totalUsers}
            </p>
          </div>
        </div>
      </div>

      <div className="sc-card p-5 sm:p-6">
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
            {filterOptions.map((option) => (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => handleStatusFilter(option.value)}
                className={[
                  "rounded-2xl px-5 py-3 text-sm font-extrabold transition",
                  statusFilter === option.value
                    ? "bg-primary text-white shadow-soft"
                    : "border border-surface-border bg-white text-ink hover:bg-primary-tint hover:text-primary",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="sc-card overflow-visible">
        <div className="flex flex-col gap-3 border-b border-surface-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Users Table
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Showing {users.length} of {totalUsers} users.
            </p>
          </div>

          <span className="w-fit rounded-full bg-primary-tint px-4 py-2 text-xs font-extrabold text-primary">
            Admin Protected
          </span>
        </div>

        {loading ? (
          <div className="p-10">
            <Loader />
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">group_off</span>
            </span>

            <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
              No user found
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-ink-muted">
              User data will appear here when people register on the platform.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Blood</th>
                  <th>Location</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((targetUser) => {
                  const userId = getUserId(targetUser);
                  const avatar =
                    targetUser.avatar ||
                    targetUser.image ||
                    targetUser.photoURL ||
                    DEFAULT_AVATAR;

                  const isMenuOpen = openMenuId === userId;

                  return (
                    <tr key={userId} className="border-surface-border">
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={targetUser.name || "User avatar"}
                            className="h-12 w-12 rounded-[18px] object-cover"
                          />

                          <div>
                            <p className="font-extrabold text-ink">
                              {targetUser.name || "No Name"}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-ink-muted">
                              ID: {String(userId).slice(0, 12)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className="text-sm font-semibold text-ink-muted">
                          {targetUser.email}
                        </p>
                      </td>

                      <td>
                        <span className="rounded-full bg-primary-tint px-4 py-2 text-xs font-extrabold capitalize text-primary">
                          {targetUser.role || "donor"}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={targetUser.status || "active"} />
                      </td>

                      <td>
                        <p className="font-extrabold text-ink">
                          {targetUser.bloodGroup || "N/A"}
                        </p>
                      </td>

                      <td>
                        <p className="font-bold text-ink">
                          {targetUser.district || "N/A"}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-ink-muted">
                          {targetUser.upazila || "N/A"}
                        </p>
                      </td>

                      <td>
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(isMenuOpen ? null : userId)
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-border bg-white text-ink-muted transition hover:bg-primary-tint hover:text-primary"
                            aria-label="Open user action menu"
                          >
                            <span className="material-symbols-rounded">
                              more_vert
                            </span>
                          </button>

                          {isMenuOpen ? (
                            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-[22px] border border-surface-border bg-white p-2 shadow-card">
                              {targetUser.status === "blocked" ? (
                                <MenuButton
                                  icon="lock_open"
                                  label="Unblock User"
                                  onClick={() =>
                                    handleStatusUpdate(targetUser, "active")
                                  }
                                />
                              ) : (
                                <MenuButton
                                  icon="block"
                                  label="Block User"
                                  tone="danger"
                                  onClick={() =>
                                    handleStatusUpdate(targetUser, "blocked")
                                  }
                                />
                              )}

                              {roleOptions.map((roleOption) => (
                                <MenuButton
                                  key={roleOption.value}
                                  icon={roleOption.icon}
                                  label={roleOption.label}
                                  disabled={targetUser.role === roleOption.value}
                                  onClick={() =>
                                    handleRoleUpdate(
                                      targetUser,
                                      roleOption.value
                                    )
                                  }
                                />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totalPages > 1 ? (
        <section className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-2xl border border-surface-border bg-white px-5 py-3 text-sm font-extrabold text-ink-muted transition hover:bg-primary-tint hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => handlePageChange(pageNumber)}
              className={[
                "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-extrabold transition",
                currentPage === pageNumber
                  ? "bg-primary text-white shadow-soft"
                  : "border border-surface-border bg-white text-ink-muted hover:bg-primary-tint hover:text-primary",
              ].join(" ")}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-2xl border border-surface-border bg-white px-5 py-3 text-sm font-extrabold text-ink-muted transition hover:bg-primary-tint hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </section>
      ) : null}
    </section>
  );
};

const MenuButton = ({ icon, label, onClick, disabled = false, tone = "default" }) => {
  const toneClass =
    tone === "danger"
      ? "text-state-danger hover:bg-red-50"
      : "text-ink-muted hover:bg-primary-tint hover:text-primary";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40",
        toneClass,
      ].join(" ")}
    >
      <span className="material-symbols-rounded text-xl">{icon}</span>
      {label}
    </button>
  );
};

export default AllUsers;