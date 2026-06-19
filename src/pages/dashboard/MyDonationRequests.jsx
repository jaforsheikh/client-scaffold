import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { recentDonationRequests } from "../../data/dashboardMockData";
import confirmModal from "../../utils/confirmModal";
import { formatDate } from "../../utils/dateFormatter";

const MyDonationRequests = () => {
  const [requests, setRequests] = useState(recentDonationRequests);

  const handleEdit = () => {
    toast("Edit request page will be connected with backend data later.");
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
        title="Manage your donation requests"
        description="Review your submitted blood donation requests, track their current status, and manage actions from one clean table."
        icon="list_alt"
        action={
          <Link to="/dashboard/create-donation-request">
            <Button icon="add_circle">Create Request</Button>
          </Link>
        }
      />

      <section className="sc-card overflow-hidden">
        <div className="border-b border-surface-border p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Submitted Requests
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Your recent blood donation request activity.
              </p>
            </div>

            <StatusBadge
              status="active"
              label={`${requests.length} Total Requests`}
            />
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon="playlist_remove"
              title="No donation requests found"
              description="You have not created any blood donation request yet."
              action={
                <Link to="/dashboard/create-donation-request">
                  <Button icon="add_circle">Create First Request</Button>
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
                  <th>Hospital</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
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
                      <p className="max-w-[220px] font-bold text-ink">
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

                    <td>
                      <div className="flex justify-end gap-2">
                        <Link to={`/donation-requests/${request.id}`}>
                          <Button variant="secondary" size="sm" icon="visibility">
                            View
                          </Button>
                        </Link>

                        <Button
                          variant="secondary"
                          size="sm"
                          icon="edit"
                          onClick={handleEdit}
                        >
                          Edit
                        </Button>

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