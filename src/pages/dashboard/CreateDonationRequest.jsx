import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS } from "../../utils/constants";

const CreateDonationRequest = () => {
  const navigate = useNavigate();
  const { user, dbUser, isBlocked } = useAuth();

  const { districts, getUpazilasByDistrict, loading: locationLoading } =
    useLocationData();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      requesterName: dbUser?.name || user?.name || user?.displayName || "",
      requesterEmail: dbUser?.email || user?.email || "",
    },
  });

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

  const blockedStatus =
    isBlocked || dbUser?.status === "blocked" || user?.status === "blocked";

  const handleDistrictChange = () => {
    resetField("recipientUpazila");
  };

  const handleCreateRequest = async (formData) => {
    if (blockedStatus) {
      toast.error("Blocked users cannot create donation requests.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosPublic.post("/api/donation-requests", {
        requesterName: formData.requesterName,
        requesterEmail: formData.requesterEmail,
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

  if (blockedStatus) {
    return (
      <section className="sc-card p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-red-50 text-state-danger">
          <span className="material-symbols-rounded text-4xl">block</span>
        </span>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
          Your account is blocked
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-ink-muted">
          Blocked users cannot create blood donation requests. Please contact
          admin support if you think this is a mistake.
        </p>

        <div className="mt-6">
          <Link to="/dashboard">
            <Button icon="dashboard">Back to Dashboard</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="sc-card p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
            <span className="material-symbols-rounded text-4xl">
              add_circle
            </span>
          </span>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Create Donation Request
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Request blood support
            </h1>

            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
              Fill in patient, hospital, location, date and message details.
              Request status will be pending by default.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleCreateRequest)}
        className="sc-card p-6 sm:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="sc-label">Requester Name</label>
            <input
              type="text"
              readOnly
              className="sc-input mt-2 bg-surface-soft"
              {...register("requesterName")}
            />
          </div>

          <div>
            <label className="sc-label">Requester Email</label>
            <input
              type="email"
              readOnly
              className="sc-input mt-2 bg-surface-soft"
              {...register("requesterEmail")}
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
              placeholder="Enter hospital name"
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
              placeholder="Enter full address"
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

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link to="/dashboard/my-donation-requests">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="sc-primary-btn px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-rounded">add_circle</span>
            {isSubmitting ? "Creating..." : "Create Request"}
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