import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/dateFormatter";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dbUser } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isDonating, setIsDonating] = useState(false);

  const donorName =
    dbUser?.name || user?.name || user?.displayName || "Scaffold Donor";
  const donorEmail = dbUser?.email || user?.email || "";

  const loadRequestDetails = async () => {
    setLoading(true);

    try {
      const { data } = await axiosPublic.get(`/api/donation-requests/${id}`);
      setRequest(data?.request || null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load donation request."
      );
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequestDetails();
  }, [id]);

  const handleConfirmDonate = async () => {
    setIsDonating(true);

    try {
      await axiosPublic.patch(`/api/donation-requests/${id}/donate`);

      toast.success("Donation confirmed successfully.");
      setIsDonateModalOpen(false);
      await loadRequestDetails();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to confirm donation."
      );
    } finally {
      setIsDonating(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-surface-page py-20">
        <Loader />
      </section>
    );
  }

  if (!request) {
    return (
      <section className="bg-surface-page py-12 sm:py-16">
        <div className="sc-container">
          <div className="sc-card mx-auto max-w-2xl p-8 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">
                inventory_2
              </span>
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
              Donation request not found
            </h1>

            <p className="mt-3 text-base font-semibold leading-7 text-ink-muted">
              The donation request you are looking for may have been removed or
              is currently unavailable.
            </p>

            <div className="mt-6">
              <Link to="/donation-requests">
                <Button icon="arrow_back">Back to Requests</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const locationText = `${
    request.district || request.recipientDistrict || "Unknown District"
  }, ${request.upazila || request.recipientUpazila || "Unknown Upazila"}`;

  return (
    <section className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container space-y-8">
        <section className="sc-card overflow-hidden">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_.75fr] lg:p-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Donation Request Details
              </p>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
                    {request.recipientName}
                  </h1>

                  <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
                    Review full blood donation request information before
                    confirming your donation support.
                  </p>
                </div>

                <BloodBadge group={request.bloodGroup} size="lg" />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <StatusBadge status={request.status} />

                <span className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-4 py-2 text-sm font-extrabold text-primary">
                  <span className="material-symbols-rounded text-lg">
                    bloodtype
                  </span>
                  {request.bloodGroup}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-surface-soft px-4 py-2 text-sm font-extrabold text-ink-muted">
                  <span className="material-symbols-rounded text-lg">
                    location_on
                  </span>
                  {locationText}
                </span>
              </div>
            </div>

            <div className="rounded-[30px] bg-ink p-6 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">
                Current Need
              </p>

              <div className="mt-6 space-y-4">
                <DarkInfo icon="local_hospital" label="Hospital" value={request.hospitalName} />
                <DarkInfo icon="calendar_month" label="Date" value={formatDate(request.donationDate)} />
                <DarkInfo icon="schedule" label="Time" value={request.donationTime} />
                <DarkInfo icon="map" label="Location" value={locationText} />
              </div>

              <div className="mt-6">
                {request.status === "pending" ? (
                  <Button
                    icon="volunteer_activism"
                    size="lg"
                    onClick={() => setIsDonateModalOpen(true)}
                  >
                    Donate
                  </Button>
                ) : (
                  <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                    <p className="text-sm font-extrabold text-white">
                      Donation already {request.status}
                    </p>

                    {request.donorEmail ? (
                      <p className="mt-1 text-xs font-semibold text-white/55">
                        Donor: {request.donorName || "Unknown"} ·{" "}
                        {request.donorEmail}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="sc-card p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Recipient Information
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon="person"
                label="Recipient Name"
                value={request.recipientName}
              />

              <InfoCard
                icon="bloodtype"
                label="Blood Group"
                value={request.bloodGroup}
              />

              <InfoCard
                icon="location_on"
                label="Recipient District"
                value={request.recipientDistrict || request.district}
              />

              <InfoCard
                icon="near_me"
                label="Recipient Upazila"
                value={request.recipientUpazila || request.upazila}
              />

              <InfoCard
                icon="local_hospital"
                label="Hospital Name"
                value={request.hospitalName}
              />

              <InfoCard
                icon="home_pin"
                label="Full Address"
                value={request.fullAddress}
              />

              <InfoCard
                icon="calendar_month"
                label="Donation Date"
                value={formatDate(request.donationDate)}
              />

              <InfoCard
                icon="schedule"
                label="Donation Time"
                value={request.donationTime}
              />
            </div>

            <div className="mt-6 rounded-[24px] border border-surface-border bg-surface-soft p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Request Message
              </p>

              <p className="mt-3 text-sm font-semibold leading-7 text-ink-muted">
                {request.requestMessage || "No message provided."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="sc-card p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Requester Information
              </p>

              <div className="mt-6 space-y-4">
                <InfoCard
                  icon="account_circle"
                  label="Requester Name"
                  value={request.requesterName}
                />

                <InfoCard
                  icon="mail"
                  label="Requester Email"
                  value={request.requesterEmail}
                />

                <InfoCard
                  icon="verified"
                  label="Request Status"
                  value={request.status}
                />
              </div>
            </div>

            <div className="rounded-[30px] bg-primary p-6 text-white shadow-card sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/60">
                Safe Donation Note
              </p>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                Confirm only when you are ready to support.
              </h2>

              <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
                After confirmation, this request status will move from pending
                to inprogress and your donor name/email will be attached to the
                request.
              </p>
            </div>
          </div>
        </section>

        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-[18px] border border-surface-border bg-white px-5 py-3 text-sm font-extrabold text-ink-muted shadow-sm transition hover:bg-primary-tint hover:text-primary"
          >
            <span className="material-symbols-rounded">arrow_back</span>
            Back
          </button>
        </div>
      </div>

      {isDonateModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[30px] bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  Confirm Donation
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                  Donate to {request.recipientName}
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
                  Your name and email will be saved as donor information for
                  this request.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDonateModalOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-ink-muted transition hover:bg-primary-tint hover:text-primary"
                aria-label="Close modal"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
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

              <div className="rounded-[24px] border border-surface-border bg-surface-soft p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-extrabold text-ink-muted">
                    New Status
                  </p>

                  <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold text-amber-700">
                    In Progress
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDonateModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                icon="volunteer_activism"
                onClick={handleConfirmDonate}
                disabled={isDonating}
              >
                {isDonating ? "Confirming..." : "Confirm Donate"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[24px] border border-surface-border bg-white p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-primary-tint text-primary">
        <span className="material-symbols-rounded">{icon}</span>
      </span>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-extrabold text-ink">
        {value || "Not provided"}
      </p>
    </div>
  );
};

const DarkInfo = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 rounded-[22px] bg-white/10 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-primary text-white">
        <span className="material-symbols-rounded">{icon}</span>
      </span>

      <div>
        <p className="text-xs font-bold text-white/45">{label}</p>
        <p className="text-sm font-extrabold text-white">{value}</p>
      </div>
    </div>
  );
};

export default DonationRequestDetails;