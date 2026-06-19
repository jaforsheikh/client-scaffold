import { useState } from "react";
import toast from "react-hot-toast";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import confirmModal from "../../utils/confirmModal";
import { formatDate } from "../../utils/dateFormatter";

const initialRequests = [
  {
    id: "REQ-1001",
    requesterName: "Nusrat Jahan",
    requesterEmail: "nusrat@example.com",
    requesterPhone: "01700000001",
    recipientName: "Arif Hossain",
    bloodGroup: "A+",
    district: "Dhaka",
    upazila: "Dhanmondi",
    hospitalName: "Popular Medical College Hospital",
    donationDate: "2026-06-20",
    donationTime: "10:30 AM",
    status: "pending",
  },
  {
    id: "REQ-1002",
    requesterName: "Mehedi Hasan",
    requesterEmail: "mehedi@example.com",
    requesterPhone: "01700000002",
    recipientName: "Tanvir Ahmed",
    bloodGroup: "O-",
    district: "Chattogram",
    upazila: "Panchlaish",
    hospitalName: "Chattogram Medical College Hospital",
    donationDate: "2026-06-21",
    donationTime: "02:00 PM",
    status: "inprogress",
  },
  {
    id: "REQ-1003",
    requesterName: "Sadia Rahman",
    requesterEmail: "sadia@example.com",
    requesterPhone: "01700000003",
    recipientName: "Mim Akter",
    bloodGroup: "B+",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    hospitalName: "MAG Osmani Medical College Hospital",
    donationDate: "2026-06-22",
    donationTime: "11:00 AM",
    status: "done",
  },
  {
    id: "REQ-1004",
    requesterName: "Rahim Uddin",
    requesterEmail: "rahim@example.com",
    requesterPhone: "01700000004",
    recipientName: "Karim Mia",
    bloodGroup: "AB-",
    district: "Rajshahi",
    upazila: "Boalia",
    hospitalName: "Rajshahi Medical College Hospital",
    donationDate: "2026-06-23",
    donationTime: "04:30 PM",
    status: "canceled",
  },
];

const AllBloodDonationRequests = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleStatusChange = async (requestId, status) => {
    const confirmed = await confirmModal({
      title: "Update request status?",
      text: `This donation request status will be changed to ${status}.`,
      confirmButtonText: "Yes, update",
      icon: "question",
    });

    if (!confirmed) return;

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );

    toast.success("Donation request status updated.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Volunteer / Admin"
        title="Manage all blood donation requests"
        description="Review all submitted donation requests and update request status based on real progress."
        icon="assignment"
      />

      <section className="grid gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total"
          value={requests.length}
          status="active"
          icon="assignment"
        />
        <SummaryCard
          label="Pending"
          value={requests.filter((item) => item.status === "pending").length}
          status="pending"
          icon="pending_actions"
        />
        <SummaryCard
          label="In Progress"
          value={requests.filter((item) => item.status === "inprogress").length}
          status="inprogress"
          icon="sync"
        />
        <SummaryCard
          label="Completed"
          value={requests.filter((item) => item.status === "done").length}
          status="done"
          icon="task_alt"
        />
      </section>

      <section className="sc-card overflow-hidden">
        <div className="border-b border-surface-border p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Donation Request List
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-muted">
                Volunteers can update request status. Admin can review all
                request activity.
              </p>
            </div>

            <StatusBadge status="volunteer" label="Status Control" />
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon="assignment_late"
              title="No donation request found"
              description="No blood donation request has been submitted yet."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <th>Blood</th>
                  <th>Recipient</th>
                  <th>Requester</th>
                  <th>Hospital</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Update</th>
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
                      <p className="font-bold text-ink">
                        {request.requesterName}
                      </p>
                      <p className="text-xs font-semibold text-ink-muted">
                        {request.requesterPhone}
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
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon="pending_actions"
                          disabled={request.status === "pending"}
                          onClick={() =>
                            handleStatusChange(request.id, "pending")
                          }
                        >
                          Pending
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          icon="sync"
                          disabled={request.status === "inprogress"}
                          onClick={() =>
                            handleStatusChange(request.id, "inprogress")
                          }
                        >
                          Progress
                        </Button>

                        <Button
                          size="sm"
                          variant="success"
                          icon="task_alt"
                          disabled={request.status === "done"}
                          onClick={() => handleStatusChange(request.id, "done")}
                        >
                          Done
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          icon="cancel"
                          disabled={request.status === "canceled"}
                          onClick={() =>
                            handleStatusChange(request.id, "canceled")
                          }
                        >
                          Cancel
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

const SummaryCard = ({ label, value, icon, status }) => {
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

      <div className="mt-4">
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

export default AllBloodDonationRequests;