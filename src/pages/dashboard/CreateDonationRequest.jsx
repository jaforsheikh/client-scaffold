import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS } from "../../utils/constants";

const CreateDonationRequest = () => {
  const { user, dbUser, isBlocked } = useAuth();
  const { districts, getUpazilasByDistrict, loading: locationLoading } =
    useLocationData();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm();

  const selectedDistrictName = useWatch({
    control,
    name: "recipientDistrict",
  });

  const selectedDistrict = useMemo(
    () => districts.find((district) => district.name === selectedDistrictName),
    [districts, selectedDistrictName]
  );

  const upazilaOptions = useMemo(() => {
    if (!selectedDistrict?.id) return [];
    return getUpazilasByDistrict(selectedDistrict.id);
  }, [selectedDistrict, getUpazilasByDistrict]);

  const requesterName =
    dbUser?.name || user?.displayName || user?.name || "Scaffold User";
  const requesterEmail = dbUser?.email || user?.email || "";

  const handleDistrictChange = () => {
    resetField("recipientUpazila");
  };

  const handleCreateRequest = async (formData) => {
    if (isBlocked) {
      toast.error("Blocked users cannot create donation requests.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosPublic.post("/api/donation-requests", {
        recipientName: formData.recipientName,
        recipientDistrict: formData.recipientDistrict,
        recipientUpazila: formData.recipientUpazila,
        hospitalName: formData.hospitalName,
        fullAddress: formData.fullAddress,
        bloodGroup: formData.bloodGroup,
        donationDate: formData.donationDate,
        donationTime: formData.donationTime,
        requestMessage: formData.requestMessage,
      });

      toast.success("Donation request created successfully.");
      reset();
      navigate("/dashboard/my-donation-requests");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to create donation request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="sc-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Create Donation Request
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Request blood donation support
            </h1>

            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
              Create a pending blood donation request with recipient, hospital,
              location, date and message details.
            </p>
          </div>

          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
            <span className="material-symbols-rounded text-4xl">
              assignment_add
            </span>
          </span>
        </div>
      </div>

      {isBlocked ? (
        <div className="sc-card border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white text-state-danger">
              <span className="material-symbols-rounded">block</span>
            </span>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Account Blocked
              </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
                Your account is currently blocked. You cannot create donation
                requests until an admin changes your status to active.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(handleCreateRequest)}
        className="sc-card p-6 sm:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="sc-label">Requester Name</label>
            <input
              type="text"
              value={requesterName}
              readOnly
              className="sc-input mt-2 bg-surface-soft"
            />
          </div>

          <div>
            <label className="sc-label">Requester Email</label>
            <input
              type="email"
              value={requesterEmail}
              readOnly
              className="sc-input mt-2 bg-surface-soft"
            />
          </div>

          <div>
            <label className="sc-label">Recipient Name</label>
            <input
              type="text"
              className="sc-input mt-2"
              placeholder="Enter recipient name"
              {...register("recipientName", {
                required: "Recipient name is required.",
              })}
            />
            {errors.recipientName ? (
              <FormError message={errors.recipientName.message} />
            ) : null}
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
            {errors.bloodGroup ? (
              <FormError message={errors.bloodGroup.message} />
            ) : null}
          </div>

          <div>
            <label className="sc-label">Recipient District</label>
            <select
              className="sc-select mt-2"
              disabled={locationLoading}
              {...register("recipientDistrict", {
                required: "Recipient district is required.",
                onChange: handleDistrictChange,
              })}
            >
              <option value="">
                {locationLoading ? "Loading districts..." : "Select district"}
              </option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            {errors.recipientDistrict ? (
              <FormError message={errors.recipientDistrict.message} />
            ) : null}
          </div>

          <div>
            <label className="sc-label">Recipient Upazila</label>
            <select
              className="sc-select mt-2"
              disabled={!selectedDistrictName || locationLoading}
              {...register("recipientUpazila", {
                required: "Recipient upazila is required.",
              })}
            >
              <option value="">
                {selectedDistrictName
                  ? "Select upazila"
                  : "Select district first"}
              </option>
              {upazilaOptions.map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name}
                </option>
              ))}
            </select>
            {errors.recipientUpazila ? (
              <FormError message={errors.recipientUpazila.message} />
            ) : null}
          </div>

          <div>
            <label className="sc-label">Hospital Name</label>
            <input
              type="text"
              className="sc-input mt-2"
              placeholder="Dhaka Medical College Hospital"
              {...register("hospitalName", {
                required: "Hospital name is required.",
              })}
            />
            {errors.hospitalName ? (
              <FormError message={errors.hospitalName.message} />
            ) : null}
          </div>

          <div>
            <label className="sc-label">Full Address</label>
            <input
              type="text"
              className="sc-input mt-2"
              placeholder="Zahir Raihan Rd, Dhaka"
              {...register("fullAddress", {
                required: "Full address is required.",
              })}
            />
            {errors.fullAddress ? (
              <FormError message={errors.fullAddress.message} />
            ) : null}
          </div>

          <div>
            <label className="sc-label">Donation Date</label>
            <input
              type="date"
              className="sc-input mt-2"
              {...register("donationDate", {
                required: "Donation date is required.",
              })}
            />
            {errors.donationDate ? (
              <FormError message={errors.donationDate.message} />
            ) : null}
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
            {errors.donationTime ? (
              <FormError message={errors.donationTime.message} />
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label className="sc-label">Request Message</label>
            <textarea
              rows="5"
              className="sc-textarea mt-2"
              placeholder="Write why blood is needed in detail"
              {...register("requestMessage", {
                required: "Request message is required.",
              })}
            />
            {errors.requestMessage ? (
              <FormError message={errors.requestMessage.message} />
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isBlocked}
            className="sc-primary-btn px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-rounded">assignment_add</span>
            {isSubmitting ? "Creating Request..." : "Request"}
          </button>
        </div>
      </form>
    </section>
  );
};

const FormError = ({ message }) => {
  return <p className="mt-2 text-xs font-bold text-state-danger">{message}</p>;
};

export default CreateDonationRequest;
