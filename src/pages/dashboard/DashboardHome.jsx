import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import {
  bloodGroupOverview,
  dashboardStats,
  dashboardTips,
  donationTrendData,
  recentDonationRequests,
} from "../../data/dashboardMockData";
import { formatDate } from "../../utils/dateFormatter";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Blood Donation Control Center"
        description="Track donation requests, donor availability, blood group demand, and platform activity from one clean dashboard."
        icon="dashboard"
        action={
          <Link to="/dashboard/create-donation-request">
            <Button icon="add_circle">Create Request</Button>
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            note={stat.note}
            tone={stat.tone}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="sc-card p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Donation Request Trend
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Monthly request and completion overview.
              </p>
            </div>

            <StatusBadge status="active" label="Live Overview" />
          </div>

          <div className="h-[310px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1E7E4" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#71717A", fontSize: 12, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 12, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "18px",
                    border: "1px solid #F1E7E4",
                    boxShadow: "0 18px 50px rgba(24, 24, 27, 0.08)",
                    fontWeight: 700,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#B91C1C"
                  fill="#FEE2E2"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#0F766E"
                  fill="#CCFBF1"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="sc-card p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Blood Group Overview
            </h2>
            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Donor supply vs active request demand.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {bloodGroupOverview.map((item) => (
              <div
                key={item.group}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-surface-border bg-surface-soft p-4"
              >
                <BloodBadge group={item.group} size="sm" />

                <div className="flex items-center gap-5 text-right">
                  <div>
                    <p className="text-xs font-bold text-ink-muted">Donors</p>
                    <p className="text-sm font-extrabold text-ink">
                      {item.donors}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-ink-muted">Requests</p>
                    <p className="text-sm font-extrabold text-primary">
                      {item.requests}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <div className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-ink">
                  Recent Donation Requests
                </h2>
                <p className="mt-1 text-sm font-semibold text-ink-muted">
                  Latest emergency requests submitted in the platform.
                </p>
              </div>

              <Link to="/dashboard/all-blood-donation-request">
                <Button variant="secondary" size="sm" icon="arrow_forward">
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <th>Blood</th>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentDonationRequests.map((request) => (
                  <tr key={request.id} className="border-surface-border">
                    <td>
                      <BloodBadge group={request.bloodGroup} size="sm" />
                    </td>

                    <td>
                      <p className="font-extrabold text-ink">
                        {request.recipientName}
                      </p>
                      <p className="text-xs font-semibold text-ink-muted">
                        {request.hospitalName}
                      </p>
                    </td>

                    <td>
                      <p className="font-bold text-ink">{request.district}</p>
                      <p className="text-xs font-semibold text-ink-muted">
                        {request.upazila}
                      </p>
                    </td>

                    <td>
                      <p className="font-bold text-ink">
                        {formatDate(request.donationDate)}
                      </p>
                      <p className="text-xs font-semibold text-ink-muted">
                        {request.donationTime}
                      </p>
                    </td>

                    <td>
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sc-card p-5 sm:p-6">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">
            Smart Donation Tips
          </h2>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            Helpful reminders for safer and faster donation support.
          </p>

          <div className="mt-6 space-y-4">
            {dashboardTips.map((tip) => (
              <div key={tip.id} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-primary-tint text-primary">
                  <span className="material-symbols-rounded">{tip.icon}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-ink">{tip.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-ink-muted">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;