import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import useAuth from "../../hooks/useAuth";
import { recentDonationRequests } from "../../data/dashboardMockData";
import { formatDate } from "../../utils/dateFormatter";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user, dbUser } = useAuth();

  const foundRequest = recentDonationRequests.find((item) => item.id === id);

  const [request, setRequest] = useState(foundRequest || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const donorName = dbUser?.name || user?.displayName || "Logged In Donor";
  const donorEmail = dbUser?.email || user?.email || "donor@example.com";

  const handleConfirmDonation = (event) => {
    event.preventDefault();

    setRequest((currentRequest) => ({
      ...currentRequest,
      status: "inprogress",
      donorName,
      donorEmail,
    }));

    setIsModalOpen(false);
    toast.success("Donation confirmed. Request status changed to in progress.");
  };

  if (!request) {
    return (
      <section className="bg-surface-page py-10 sm:py-14">
        <div className="sc-container">
          <EmptyState
            icon="search_off"
            title="Donation request not found"
            description="The request you are looking for is not available or may have been removed."
            action={
              <Link to="/donation-requests">
                <Button icon="arrow_back">Back to Requests</Button>
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container space-y-6">
        <PageHeader
          eyebrow={`Request ID: ${request.id}`}
          title={`${request.bloodGroup} blood needed for ${request.recipientName}`}
          description="Review all donation request information before confirming your donation support."
          icon="bloodtype"
          action={
            <Link to="/donation-requests">
              <Button variant="secondary" icon="arrow_back">
                Back
              </Button>
            </Link>
          }
        />

        <section className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <div className="sc-card p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <BloodBadge group={request.bloodGroup} size="lg" />

              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
                {request.recipientName}
              </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
                Recipient needs blood donation support.
              </p>

              <div className="mt-5">
                <StatusBadge status={request.status} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <InfoBox
                icon="local_hospital"
                label="Hospital Name"
                value={request.hospitalName}
              />

              <InfoBox
                icon="location_on"
                label="Recipient Location"
                value={`${request.district}, ${request.upazila}`}
              />

              <InfoBox
                icon="home_pin"
                label="Full Address"
                value={request.fullAddress}
              />

              <InfoBox
                icon="event"
                label="Donation Date"
                value={formatDate(request.donationDate)}
              />

              <InfoBox
                icon="schedule"
                label="Donation Time"
                value={request.donationTime}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="sc-card overflow-hidden">
              <div className="border-b border-surface-border p-5 sm:p-6">
                <h2 className="text-xl font-extrabold tracking-tight text-ink">
                  Requester Information
                </h2>

                <p className="mt-1 text-sm font-semibold text-ink-muted">
                  Information submitted when the donation request was created.
                </p>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <InfoCard
                  icon="person"
                  label="Requester Name"
                  value={request.requesterName}
                />

                <InfoCard
                  icon="mail"
                  label="Requester Email"
                  value={request.requesterEmail}
                />

                <InfoCard
                  icon="call"
                  label="Requester Phone"
                  value={request.requesterPhone}
                />

                <InfoCard
                  icon="verified"
                  label="Request Status"
                  value={request.status}
                  capitalize
                />
              </div>
            </div>

            <div className="sc-card overflow-hidden">
              <div className="border-b border-surface-border p-5 sm:p-6">
                <h2 className="text-xl font-extrabold tracking-tight text-ink">
                  Request Message
                </h2>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-sm font-semibold leading-7 text-ink-muted">
                  {request.requestMessage}
                </p>
              </div>
            </div>

            {request.status === "inprogress" && request.donorEmail ? (
              <div className="sc-card overflow-hidden">
                <div className="border-b border-surface-border p-5 sm:p-6">
                  <h2 className="text-xl font-extrabold tracking-tight text-ink">
                    Donor Information
                  </h2>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                  <InfoCard
                    icon="volunteer_activism"
                    label="Donor Name"
                    value={request.donorName}
                  />

                  <InfoCard
                    icon="mail"
                    label="Donor Email"
                    value={request.donorEmail}
                  />
                </div>
              </div>
            ) : null}

            <div className="sc-card p-6 sm:p-8">
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Donation Action
              </h2>

              <p className="mt-3 text-sm font-semibold leading-7 text-ink-muted">
                Confirm donation only if you are eligible, physically fit, and
                ready to communicate with the requester.
              </p>

              <div className="mt-6 rounded-[24px] border border-state-warning/20 bg-state-warningTint p-5">
                <div className="flex gap-3">
                  <span className="material-symbols-rounded text-state-warning">
                    health_and_safety
                  </span>

                  <div>
                    <h3 className="font-extrabold text-ink">
                      Donate responsibly
                    </h3>

                    <p className="mt-1 text-sm font-semibold leading-6 text-ink-muted">
                      Do not donate if you are sick, under medication, recently
                      donated blood, or not medically eligible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {request.status === "pending" ? (
                  <Button
                    icon="volunteer_activism"
                    className="w-full"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Donate
                  </Button>
                ) : (
                  <Button variant="secondary" icon="info" className="w-full" disabled>
                    Donation already {request.status}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
          <form
            onSubmit={handleConfirmDonation}
            className="w-full max-w-lg rounded-[30px] bg-white p-6 shadow-card sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  Confirm Donation
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                  Confirm your donor information
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
                  Your name and email will be attached as donor information for
                  this request.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-ink-muted transition hover:bg-primary-tint hover:text-primary"
                aria-label="Close modal"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="sc-label">Donor Name</label>
                <input
                  type="text"
                  value={donorName}
                  readOnly
                  className="sc-input mt-2 bg-surface-soft"
                />
              </div>

              <div>
                <label className="sc-label">Donor Email</label>
                <input
                  type="email"
                  value={donorEmail}
                  readOnly
                  className="sc-input mt-2 bg-surface-soft"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                icon="close"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" icon="check_circle">
                Confirm Donation
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
};

const InfoBox = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-surface-border bg-surface-soft p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-white text-primary shadow-sm">
        <span className="material-symbols-rounded">{icon}</span>
      </span>

      <div>
        <p className="text-xs font-bold text-ink-muted">{label}</p>
        <p className="text-sm font-extrabold text-ink">{value}</p>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, capitalize = false }) => {
  return (
    <div className="rounded-[24px] border border-surface-border bg-surface-soft p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-white text-primary shadow-sm">
          <span className="material-symbols-rounded">{icon}</span>
        </span>

        <div className="min-w-0">
          <p className="text-xs font-bold text-ink-muted">{label}</p>
          <p
            className={[
              "truncate text-sm font-extrabold text-ink",
              capitalize ? "capitalize" : "",
            ].join(" ")}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationRequestDetails;