import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import useAuth from "../../hooks/useAuth";
import { recentDonationRequests } from "../../data/dashboardMockData";
import confirmModal from "../../utils/confirmModal";
import { formatDate } from "../../utils/dateFormatter";

const statusFilters = ["all", "pending", "inprogress", "done", "canceled"];

const MyDonationRequests = () => {
  const { user, dbUser } = useAuth();

  const requesterName = dbUser?.name || user?.displayName || "Scaffold User";
  const requesterEmail = dbUser?.email || user?.email || "user@scaffold.com";

  const ownMockRequests = useMemo(
    () =>
      recentDonationRequests.map((request) => ({
        ...request,
        requesterName,
        requesterEmail,
      })),
    [requesterEmail, requesterName]
  );

  const [requests, setRequests] = useState(ownMockRequests);
  const [activeStatus, setActiveStatus] = useState("all");

  const filteredRequests = useMemo(() => {
    if (activeStatus === "all") return requests;

    return requests.filter((request) => request.status === activeStatus);
  }, [activeStatus, requests]);

  const handleStatusChange = async (requestId, status) => {
    const confirmed = await confirmModal({
      title: "Update donation status?",
      text: `This request status will be changed to ${status}.`,
      confirmButtonText: "Yes, update",
      icon: "question",
    });

    if (!confirmed) return;

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );

    toast.success(`Donation request marked as ${status}.`);
  };

  const handleDelete = async (requestId) => {
    const confirmed = await confirmModal({
      title: "Delete this request?",
      text: "This donation request will be removed from your list.",
      confirmButtonText: "Yes, delete",
      icon: "warning",
    });

    if (!confirmed) return;

    setRequests((currentRequests) =>
      currentRequests.filter((request) => request.id !== requestId)
    );

    toast.success("Donation request deleted successfully.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Requests"
        title="My blood donation requests"
        description="View, filter, update, edit and manage all blood donation requests created by your account."
        icon="list_alt"
        action={
          <Link to="/dashboard/create-donation-request">
            <Button icon="add_circle">Create Request</Button>
          </Link>
        }
      />

      <section className="sc-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Filter Requests
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Filter your donation requests by donation status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={activeStatus === status ? "primary" : "secondary"}
                onClick={() => setActiveStatus(status)}
              >
                {status === "all"
                  ? "All"
                  : status === "inprogress"
                    ? "In Progress"
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
                My Request Table
              </h2>

              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Showing requests created by: {requesterEmail}
              </p>
            </div>

            <StatusBadge
              status="active"
              label={`${filteredRequests.length} Showing`}
            />
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon="playlist_remove"
              title="No donation requests found"
              description="No request matched your selected filter."
              action={
                <Link to="/dashboard/create-donation-request">
                  <Button icon="add_circle">Create Request</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <th>Blood</th>
                  <th>Recipient</th>
                  <th>Recipient Location</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-surface-border">
                    <td>
                      <BloodBadge group={request.bloodGroup} size="sm" />
                    </td>

                    <td>
                      <p className="font-extrabold text-ink">
                        {request.recipientName}
                      </p>
                      <p className="text-xs font-semibold text-ink-muted">
                        ID: {request.id}
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

                    <td>
                      {request.status === "inprogress" &&
                      request.donorEmail ? (
                        <div>
                          <p className="font-bold text-ink">
                            {request.donorName}
                          </p>
                          <p className="text-xs font-semibold text-ink-muted">
                            {request.donorEmail}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-ink-muted">
                          Not assigned
                        </p>
                      )}
                    </td>

                    <td>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link to={`/donation-requests/${request.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon="visibility"
                          >
                            View
                          </Button>
                        </Link>

                        <Link
                          to={`/dashboard/update-donation-request/${request.id}`}
                        >
                          <Button variant="secondary" size="sm" icon="edit">
                            Edit
                          </Button>
                        </Link>

                        {request.status === "inprogress" ? (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              icon="task_alt"
                              onClick={() =>
                                handleStatusChange(request.id, "done")
                              }
                            >
                              Done
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              icon="cancel"
                              onClick={() =>
                                handleStatusChange(request.id, "canceled")
                              }
                            >
                              Cancel
                            </Button>
                          </>
                        ) : null}

                        <Button
                          variant="danger"
                          size="sm"
                          icon="delete"
                          onClick={() => handleDelete(request.id)}
                        >
                          Delete
                        </Button>
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

export default MyDonationRequests;