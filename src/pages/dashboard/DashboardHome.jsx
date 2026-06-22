import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosPublic from "../../api/axiosPublic";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/dateFormatter";

const DashboardHome = () => {
  const { user, dbUser, isAdmin, isVolunteer } = useAuth();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const displayName = dbUser?.name || user?.displayName || user?.name || "User";
  const role = dbUser?.role || user?.role || "donor";

  const loadDashboardSummary = async () => {
    setLoading(true);

    try {
      const { data } = await axiosPublic.get("/api/dashboard/summary");
      setSummary(data);
    } catch (error) {
      console.error(error);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardSummary();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <Loader />
      </section>
    );
  }

  const stats = summary?.stats || {};
  const recentRequests = summary?.recentRequests || [];
  const showAdminStats = isAdmin || isVolunteer || role === "admin" || role === "volunteer";

  return (
    <section className="space-y-8">
      <div className="sc-card overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary via-red-700 to-rose-900 p-6 text-white sm:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/75">
                Welcome Back
              </p>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Hello, {displayName}
              </h1>

              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/80">
                Manage blood donation requests, donor activities, platform
                users and lifesaving actions from your dashboard.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Current Role
              </p>

              <p className="mt-2 text-3xl font-extrabold capitalize">
                {role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAdminStats ? (
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            icon="group"
            label="Total Users"
            value={stats.totalUsers || 0}
            description="All registered platform users"
          />

          <StatCard
            icon="bloodtype"
            label="Total Donors"
            value={stats.totalDonors || 0}
            description="Active donor community"
          />

          <StatCard
            icon="volunteer_activism"
            label="Total Requests"
            value={stats.totalRequests || 0}
            description="All blood donation requests"
          />

          <StatCard
            icon="payments"
            label="Total Funding"
            value={`$${Number(stats.totalFunding || 0).toFixed(2)}`}
            description="Total platform funding"
          />
        </div>
      ) : (
        <section className="sc-card overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-surface-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Recent Requests
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                My recent donation requests
              </h2>

              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Latest 3 requests created by your account.
              </p>
            </div>

            <Link to="/dashboard/create-donation-request">
              <Button icon="add_circle">Create Request</Button>
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="p-10 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
                <span className="material-symbols-rounded text-4xl">
                  inventory_2
                </span>
              </span>

              <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
                No donation request yet
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-ink-muted">
                Create a blood donation request and your recent requests will
                appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                    <th>Blood</th>
                    <th>Recipient</th>
                    <th>Location</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.map((request) => {
                    const requestId = request.id || request._id;
                    const locationText = `${
                      request.district || request.recipientDistrict || "N/A"
                    }, ${request.upazila || request.recipientUpazila || "N/A"}`;

                    return (
                      <tr key={requestId} className="border-surface-border">
                        <td>
                          <BloodBadge group={request.bloodGroup} size="sm" />
                        </td>

                        <td>
                          <p className="font-extrabold text-ink">
                            {request.recipientName}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-ink-muted">
                            {request.hospitalName}
                          </p>
                        </td>

                        <td>
                          <p className="font-bold text-ink">{locationText}</p>
                        </td>

                        <td>
                          <p className="font-bold text-ink">
                            {formatDate(request.donationDate)}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-ink-muted">
                            {request.donationTime}
                          </p>
                        </td>

                        <td>
                          <StatusBadge status={request.status} />
                        </td>

                        <td>
                          <div className="flex justify-end gap-2">
                            <Link to={`/donation-requests/${requestId}`}>
                              <SmallAction icon="visibility" label="View" />
                            </Link>

                            <Link
                              to={`/dashboard/update-donation-request/${requestId}`}
                            >
                              <SmallAction icon="edit" label="Edit" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {recentRequests.length > 0 ? (
            <div className="border-t border-surface-border p-5 text-center">
              <Link to="/dashboard/my-donation-requests">
                <Button variant="secondary" icon="arrow_forward">
                  View All My Requests
                </Button>
              </Link>
            </div>
          ) : null}
        </section>
      )}
    </section>
  );
};

const StatCard = ({ icon, label, value, description }) => {
  return (
    <article className="sc-card p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary-tint text-primary">
          <span className="material-symbols-rounded text-3xl">{icon}</span>
        </span>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold text-green-700">
          Live
        </span>
      </div>

      <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </p>

      <h3 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
        {value}
      </h3>

      <p className="mt-2 text-sm font-semibold text-ink-muted">
        {description}
      </p>
    </article>
  );
};

const SmallAction = ({ icon, label }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-surface-border bg-white px-4 py-2 text-xs font-extrabold text-ink transition hover:bg-primary-tint hover:text-primary"
    >
      <span className="material-symbols-rounded text-lg">{icon}</span>
      {label}
    </button>
  );
};

export default DashboardHome;