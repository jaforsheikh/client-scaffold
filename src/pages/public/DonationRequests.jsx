import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BloodBadge from "../../components/common/BloodBadge";
import StatusBadge from "../../components/common/StatusBadge";
import { donationRequestMockData } from "../../data/donationRequestMockData";
import { DONATION_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/dateFormatter";

const REQUESTS_PER_PAGE = 6;

const DonationRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const pendingRequests = useMemo(
    () =>
      donationRequestMockData.filter(
        (request) => request.status === DONATION_STATUS.PENDING
      ),
    []
  );

  const totalRequests = pendingRequests.length;
  const totalPages = Math.ceil(totalRequests / REQUESTS_PER_PAGE);

  const startIndex = (currentPage - 1) * REQUESTS_PER_PAGE;
  const endIndex = startIndex + REQUESTS_PER_PAGE;

  const currentRequests = pendingRequests.slice(startIndex, endIndex);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container">
        <section className="sc-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
                <span className="material-symbols-rounded text-4xl">
                  volunteer_activism
                </span>
              </span>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  Donation Requests
                </p>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  Pending blood donation requests
                </h1>

                <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
                  Browse only pending blood donation requests. Open a request to
                  review full details and respond safely.
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/create-donation-request"
              className="sc-primary-btn justify-center px-6 py-3"
            >
              <span className="material-symbols-rounded">add_circle</span>
              Create Request
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-surface-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Pending Requests Only
              </h2>

              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Showing {currentRequests.length} of {totalRequests} pending
                donation requests.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-4 py-2 text-sm font-extrabold text-amber-700">
              {totalRequests} Pending
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {currentRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </section>

        {totalPages > 1 ? (
          <section className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-surface-border bg-white px-4 text-sm font-extrabold text-ink-muted shadow-sm transition hover:border-primary/30 hover:bg-primary-tint hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="material-symbols-rounded text-xl">
                chevron_left
              </span>
              Prev
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-extrabold shadow-sm transition",
                    currentPage === pageNumber
                      ? "bg-primary text-white"
                      : "border border-surface-border bg-white text-ink-muted hover:border-primary/30 hover:bg-primary-tint hover:text-primary",
                  ].join(" ")}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-surface-border bg-white px-4 text-sm font-extrabold text-ink-muted shadow-sm transition hover:border-primary/30 hover:bg-primary-tint hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <span className="material-symbols-rounded text-xl">
                chevron_right
              </span>
            </button>
          </section>
        ) : null}
      </div>
    </div>
  );
};

const RequestCard = ({ request }) => {
  return (
    <article className="sc-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Request ID : {request.id}
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">
              {request.recipientName}
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              {request.hospitalName}
            </p>
          </div>

          <BloodBadge group={request.bloodGroup} size="md" />
        </div>
      </div>

      <div className="border-t border-surface-border p-6">
        <div className="space-y-4">
          <RequestInfo
            icon="location_on"
            label="Location"
            value={`${request.district}, ${request.upazila}`}
          />

          <RequestInfo
            icon="calendar_month"
            label="Donation Date"
            value={formatDate(request.donationDate)}
          />

          <RequestInfo
            icon="schedule"
            label="Donation Time"
            value={request.donationTime}
          />
        </div>

        <div className="mt-6 rounded-[22px] border border-surface-border bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-extrabold text-ink-muted">
              Current Status
            </p>

            <StatusBadge status={request.status} />
          </div>
        </div>

        <Link
          to={`/donation-requests/${request.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          <span className="material-symbols-rounded text-xl">visibility</span>
          View Details
        </Link>
      </div>
    </article>
  );
};

const RequestInfo = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-primary-tint text-primary">
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