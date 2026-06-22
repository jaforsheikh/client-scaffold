import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS } from "../../utils/constants";

const UpdateDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { districts, getUpazilasByDistrict, loading: locationLoading } =
    useLocationData();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const loadRequest = async () => {
    setLoading(true);

    try {
      const { data } = await axiosPublic.get(`/api/donation-requests/${id}`);
      const loadedRequest = data?.request;

      if (!loadedRequest) {
        throw new Error("Donation request not found.");
      }

      setRequest(loadedRequest);

      reset({
        requesterName: loadedRequest.requesterName || "",
        requesterEmail: loadedRequest.requesterEmail || "",
        recipientName: loadedRequest.recipientName || "",
        bloodGroup: loadedRequest.bloodGroup || "",
        recipientDistrict:
          loadedRequest.recipientDistrict || loadedRequest.district || "",
        recipientUpazila:
          loadedRequest.recipientUpazila || loadedRequest.upazila || "",
        hospitalName: loadedRequest.hospitalName || "",
        fullAddress: loadedRequest.fullAddress || "",
        donationDate: loadedRequest.donationDate || "",
        donationTime: loadedRequest.donationTime || "",
        requestMessage: loadedRequest.requestMessage || "",
      });
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
    loadRequest();
  }, [id]);

  const handleDistrictChange = () => {
    resetField("recipientUpazila");
  };

  const handleUpdateRequest = async (formData) => {
    setIsUpdating(true);

    try {
      await axiosPublic.patch(`/api/donation-requests/${id}`, {
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

      toast.success("Donation request updated successfully.");
      navigate("/dashboard/my-donation-requests");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update donation request."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <Loader />
      </section>
    );
  }

  if (!request) {
    return (
      <section className="sc-card p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
          <span className="material-symbols-rounded text-4xl">inventory_2</span>
        </span>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
          Donation request not found
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-ink-muted">
          This request may have been removed or you may not have permission to
          update it.
        </p>

        <div className="mt-6">
          <Link to="/dashboard/my-donation-requests">
            <Button icon="arrow_back">Back to My Requests</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="sc-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">edit_note</span>
            </span>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Update Donation Request
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Edit blood donation request
              </h1>

              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
                Update recipient, hospital, location, date, time and request
                message details.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={request.status} />

            <Link to="/dashboard/my-donation-requests">
              <Button icon="arrow_back" variant="secondary">
                My Requests
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdateRequest)}
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
            disabled={isUpdating}
            className="sc-primary-btn px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-rounded">save</span>
            {isUpdating ? "Updating..." : "Update Request"}
          </button>
        </div>
      </form>
    </section>
  );
};

const FormError = ({ message }) => {
  return <p className="mt-2 text-xs font-bold text-state-danger">{message}</p>;
};

export default UpdateDonationRequest;