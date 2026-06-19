import { Link } from "react-router-dom";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { recentDonationRequests } from "../../data/dashboardMockData";
import { formatDate } from "../../utils/dateFormatter";

const DonationRequests = () => {
  const pendingRequests = recentDonationRequests.filter(
    (request) => request.status === "pending"
  );

  return (
    <section className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container space-y-6">
        <PageHeader
          eyebrow="Donation Requests"
          title="Pending blood donation requests"
          description="Browse only pending blood donation requests. Open a request to review full details and respond safely."
          icon="volunteer_activism"
          action={
            <Link to="/dashboard/create-donation-request">
              <Button icon="add_circle">Create Request</Button>
            </Link>
          }
        />

        <section className="sc-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Pending Requests Only
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Public request page shows only pending donation requests.
              </p>
            </div>

            <StatusBadge
              status="pending"
              label={`${pendingRequests.length} Pending`}
            />
          </div>
        </section>

        {pendingRequests.length === 0 ? (
          <EmptyState
            icon="assignment_late"
            title="No pending donation request found"
            description="There is no pending blood donation request available right now."
          />
        ) : (
          <section className="grid gap-5 lg:grid-cols-3">
            {pendingRequests.map((request) => (
              <article key={request.id} className="sc-card overflow-hidden">
                <div className="border-b border-surface-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                        Request ID: {request.id}
                      </p>

                      <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
                        {request.recipientName}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-ink-muted">
                        {request.hospitalName}
                      </p>
                    </div>

                    <BloodBadge group={request.bloodGroup} size="md" />
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <InfoRow
                    icon="location_on"
                    label="Location"
                    value={`${request.district}, ${request.upazila}`}
                  />

                  <InfoRow
                    icon="event"
                    label="Donation Date"
                    value={formatDate(request.donationDate)}
                  />

                  <InfoRow
                    icon="schedule"
                    label="Donation Time"
                    value={request.donationTime}
                  />

                  <div className="flex items-center justify-between gap-3 rounded-[22px] border border-surface-border bg-surface-soft p-4">
                    <p className="text-sm font-extrabold text-ink-muted">
                      Current Status
                    </p>
                    <StatusBadge status={request.status} />
                  </div>

                  <Link to={`/donation-requests/${request.id}`}>
                    <Button icon="visibility" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </section>
  );
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-primary-tint text-primary">
        <span className="material-symbols-rounded">{icon}</span>
      </span>

      <div>
        <p className="text-xs font-bold text-ink-muted">{label}</p>
        <p className="text-sm font-extrabold text-ink">{value}</p>
      </div>
    </div>
  );
};

export default DonationRequests;