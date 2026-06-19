import { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";
import PageHeader from "../../components/common/PageHeader";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS } from "../../utils/constants";
import { getTodayDate } from "../../utils/dateFormatter";

const CreateDonationRequest = () => {
  const { user, dbUser } = useAuth();
  const { districts, loading, getUpazilasByDistrict } = useLocationData();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      requesterName: dbUser?.name || user?.displayName || "",
      requesterEmail: dbUser?.email || user?.email || "",
      requesterPhone: dbUser?.phone || "",
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

  const onSubmit = async (data) => {
    const selectedDistrict = districts.find(
      (district) => String(district.id) === String(data.recipientDistrictId)
    );

    const selectedUpazila = filteredUpazilas.find(
      (upazila) => String(upazila.id) === String(data.recipientUpazilaId)
    );

    const donationRequest = {
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      requesterPhone: data.requesterPhone,
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
      donationStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("Donation Request:", donationRequest);

    toast.success("Donation request created successfully.");

    reset({
      requesterName: dbUser?.name || user?.displayName || "",
      requesterEmail: dbUser?.email || user?.email || "",
      requesterPhone: dbUser?.phone || "",
      recipientName: "",
      recipientDistrictId: "",
      recipientUpazilaId: "",
      hospitalName: "",
      fullAddress: "",
      bloodGroup: "",
      donationDate: "",
      donationTime: "",
      requestMessage: "",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create Request"
        title="Create a blood donation request"
        description="Submit accurate recipient, hospital, blood group, date and location information so donors can respond faster."
        icon="add_circle"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Requester Information
            </h2>
            <p className="mt-1 text-sm font-semibold text-ink-muted">
              This information helps admins verify who created the request.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label className="sc-label">Requester Name</label>
              <input
                type="text"
                className="sc-input mt-2"
                placeholder="Your full name"
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

            <div className="sm:col-span-2">
              <label className="sc-label">Requester Phone</label>
              <input
                type="tel"
                className="sc-input mt-2"
                placeholder="Example: 01700000000"
                {...register("requesterPhone", {
                  required: "Phone number is required.",
                })}
              />
              <FormError message={errors.requesterPhone?.message} />
            </div>
          </div>
        </section>

        <section className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Recipient & Hospital Details
            </h2>
            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Add clear patient and hospital information for the donor.
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

            <div>
              <label className="sc-label">Full Address</label>
              <input
                type="text"
                className="sc-input mt-2"
                placeholder="Ward, road, building, floor"
                {...register("fullAddress", {
                  required: "Full address is required.",
                })}
              />
              <FormError message={errors.fullAddress?.message} />
            </div>

            <div className="sm:col-span-2">
              <label className="sc-label">Request Message</label>
              <textarea
                rows="5"
                className="sc-textarea mt-2"
                placeholder="Write short details about the emergency, patient condition, or donor instructions."
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

        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            icon="restart_alt"
            onClick={() => reset()}
          >
            Reset Form
          </Button>

          <Button type="submit" icon="send" loading={isSubmitting}>
            Create Donation Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;