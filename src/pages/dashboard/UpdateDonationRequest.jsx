import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import FormError from "../../components/common/FormError";
import PageHeader from "../../components/common/PageHeader";
import useLocationData from "../../hooks/useLocationData";
import { recentDonationRequests } from "../../data/dashboardMockData";
import { BLOOD_GROUPS } from "../../utils/constants";
import { getTodayDate } from "../../utils/dateFormatter";

const UpdateDonationRequest = () => {
  const { id } = useParams();
  const { districts, loading, getUpazilasByDistrict } = useLocationData();

  const request = recentDonationRequests.find((item) => item.id === id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      recipientName: "",
      recipientDistrictId: "",
      recipientUpazilaId: "",
      hospitalName: "",
      fullAddress: "",
      bloodGroup: "",
      donationDate: "",
      donationTime: "",
      requestMessage: "",
    },
  });

  const selectedDistrictId = watch("recipientDistrictId");

  const filteredUpazilas = useMemo(
    () => getUpazilasByDistrict(selectedDistrictId),
    [getUpazilasByDistrict, selectedDistrictId]
  );

  useEffect(() => {
    if (!request || districts.length === 0) return;

    const matchedDistrict = districts.find(
      (district) => district.name === request.district
    );

    const matchedUpazilas = matchedDistrict
      ? getUpazilasByDistrict(matchedDistrict.id)
      : [];

    const matchedUpazila = matchedUpazilas.find(
      (upazila) => upazila.name === request.upazila
    );

    reset({
      requesterName: request.requesterName || "",
      requesterEmail: request.requesterEmail || "",
      recipientName: request.recipientName || "",
      recipientDistrictId: matchedDistrict?.id || "",
      recipientUpazilaId: matchedUpazila?.id || "",
      hospitalName: request.hospitalName || "",
      fullAddress: request.fullAddress || "",
      bloodGroup: request.bloodGroup || "",
      donationDate: request.donationDate || "",
      donationTime: request.donationTime || "",
      requestMessage: request.requestMessage || "",
    });
  }, [districts, getUpazilasByDistrict, request, reset]);

  const onSubmit = async (data) => {
    const selectedDistrict = districts.find(
      (district) => String(district.id) === String(data.recipientDistrictId)
    );

    const selectedUpazila = filteredUpazilas.find(
      (upazila) => String(upazila.id) === String(data.recipientUpazilaId)
    );

    const updatedDonationRequest = {
      id: request.id,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      recipientName: data.recipientName,
      recipientDistrict: selectedDistrict?.name || "",
      recipientDistrictId: data.recipientDistrictId,
      recipientUpazila: selectedUpazila?.name || "",
      recipientUpazilaId: data.recipientUpazilaId,
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      status: request.status,
      donorName: request.donorName || "",
      donorEmail: request.donorEmail || "",
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated Donation Request:", updatedDonationRequest);

    toast.success("Donation request updated successfully.");
  };

  if (!request) {
    return (
      <EmptyState
        icon="search_off"
        title="Donation request not found"
        description="The request you want to update is not available."
        action={
          <Link to="/dashboard/my-donation-requests">
            <Button icon="arrow_back">Back to My Requests</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Update Request: ${request.id}`}
        title="Update blood donation request"
        description="Edit recipient, hospital, location, blood group, date, time and request message information."
        icon="edit"
        action={
          <Link to="/dashboard/my-donation-requests">
            <Button variant="secondary" icon="arrow_back">
              Back
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Requester Information
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Requester name and email remain read-only.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label className="sc-label">Requester Name</label>
              <input
                type="text"
                className="sc-input mt-2 bg-surface-soft"
                readOnly
                {...register("requesterName", {
                  required: "Requester name is required.",
                })}
              />
              <FormError message={errors.requesterName?.message} />
            </div>

            <div>
              <label className="sc-label">Requester Email</label>
              <input
                type="email"
                className="sc-input mt-2 bg-surface-soft"
                readOnly
                {...register("requesterEmail", {
                  required: "Requester email is required.",
                })}
              />
              <FormError message={errors.requesterEmail?.message} />
            </div>
          </div>
        </section>

        <section className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Donation Request Details
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Update the request information carefully.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label className="sc-label">Recipient Name</label>
              <input
                type="text"
                className="sc-input mt-2"
                placeholder="Recipient full name"
                {...register("recipientName", {
                  required: "Recipient name is required.",
                })}
              />
              <FormError message={errors.recipientName?.message} />
            </div>

            <div>
              <label className="sc-label">Blood Group</label>
              <select
                className="sc-select mt-2"
                {...register("bloodGroup", {
                  required: "Blood group is required.",
                })}
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <FormError message={errors.bloodGroup?.message} />
            </div>

            <div>
              <label className="sc-label">Recipient District</label>
              <select
                className="sc-select mt-2"
                disabled={loading}
                {...register("recipientDistrictId", {
                  required: "District is required.",
                })}
              >
                <option value="">
                  {loading ? "Loading districts..." : "Select district"}
                </option>

                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              <FormError message={errors.recipientDistrictId?.message} />
            </div>

            <div>
              <label className="sc-label">Recipient Upazila</label>
              <select
                className="sc-select mt-2"
                disabled={!selectedDistrictId || loading}
                {...register("recipientUpazilaId", {
                  required: "Upazila is required.",
                })}
              >
                <option value="">
                  {!selectedDistrictId
                    ? "Select district first"
                    : "Select upazila"}
                </option>

                {filteredUpazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.id}>
                    {upazila.name}
                  </option>
                ))}
              </select>
              <FormError message={errors.recipientUpazilaId?.message} />
            </div>

            <div>
              <label className="sc-label">Hospital Name</label>
              <input
                type="text"
                className="sc-input mt-2"
                placeholder="Hospital or clinic name"
                {...register("hospitalName", {
                  required: "Hospital name is required.",
                })}
              />
              <FormError message={errors.hospitalName?.message} />
            </div>

            <div>
              <label className="sc-label">Full Address Line</label>
              <input
                type="text"
                className="sc-input mt-2"
                placeholder="Example: Zahir Raihan Rd, Dhaka"
                {...register("fullAddress", {
                  required: "Full address is required.",
                })}
              />
              <FormError message={errors.fullAddress?.message} />
            </div>

            <div>
              <label className="sc-label">Donation Date</label>
              <input
                type="date"
                min={getTodayDate()}
                className="sc-input mt-2"
                {...register("donationDate", {
                  required: "Donation date is required.",
                })}
              />
              <FormError message={errors.donationDate?.message} />
            </div>

            <div>
              <label className="sc-label">Donation Time</label>
              <input
                type="time"
                className="sc-input mt-2"
                {...register("donationTime", {
                  required: "Donation time is required.",
                })}
              />
              <FormError message={errors.donationTime?.message} />
            </div>

            <div className="sm:col-span-2">
              <label className="sc-label">Request Message</label>
              <textarea
                rows="5"
                className="sc-textarea mt-2"
                placeholder="Write why blood is needed in detail."
                {...register("requestMessage", {
                  required: "Request message is required.",
                  minLength: {
                    value: 20,
                    message: "Message must be at least 20 characters.",
                  },
                })}
              />
              <FormError message={errors.requestMessage?.message} />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" icon="save" loading={isSubmitting}>
            Update Donation Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDonationRequest;