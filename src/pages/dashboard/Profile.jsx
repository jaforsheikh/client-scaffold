import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import uploadImage from "../../api/uploadImage";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS, DEFAULT_AVATAR } from "../../utils/constants";

const Profile = () => {
  const { user, dbUser, updateUserProfile, refreshSession } = useAuth();
  const { districts, getUpazilasByDistrict, loading: locationLoading } =
    useLocationData();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const profileUser = dbUser || user || {};

  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      bloodGroup: "",
      district: "",
      upazila: "",
      role: "donor",
      status: "active",
    },
  });

  const selectedDistrictName = useWatch({
    control,
    name: "district",
  });

  const selectedDistrict = useMemo(
    () => districts.find((district) => district.name === selectedDistrictName),
    [districts, selectedDistrictName]
  );

  const upazilaOptions = useMemo(() => {
    if (!selectedDistrict?.id) return [];
    return getUpazilasByDistrict(selectedDistrict.id);
  }, [selectedDistrict, getUpazilasByDistrict]);

  const currentAvatar =
    profileUser.avatar ||
    profileUser.photoURL ||
    profileUser.image ||
    DEFAULT_AVATAR;

  useEffect(() => {
    reset({
      name: profileUser.name || profileUser.displayName || "",
      email: profileUser.email || "",
      bloodGroup: profileUser.bloodGroup || "",
      district: profileUser.district || "",
      upazila: profileUser.upazila || "",
      role: profileUser.role || "donor",
      status: profileUser.status || "active",
    });

    setPreviewUrl(currentAvatar);
  }, [
    profileUser.name,
    profileUser.displayName,
    profileUser.email,
    profileUser.bloodGroup,
    profileUser.district,
    profileUser.upazila,
    profileUser.role,
    profileUser.status,
    currentAvatar,
    reset,
  ]);

  const handleDistrictChange = () => {
    resetField("upazila");
  };

  const handleAvatarPreview = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewUrl(currentAvatar);
      return;
    }

    const temporaryUrl = URL.createObjectURL(file);
    setPreviewUrl(temporaryUrl);
  };

  const handleCancelEdit = () => {
    reset({
      name: profileUser.name || profileUser.displayName || "",
      email: profileUser.email || "",
      bloodGroup: profileUser.bloodGroup || "",
      district: profileUser.district || "",
      upazila: profileUser.upazila || "",
      role: profileUser.role || "donor",
      status: profileUser.status || "active",
    });

    setPreviewUrl(currentAvatar);
    setIsEditing(false);
  };

  const handleProfileUpdate = async (formData) => {
    setIsSaving(true);

    try {
      let avatarUrl = currentAvatar;
      const selectedAvatarFile = formData.avatarFile?.[0];

      if (selectedAvatarFile) {
        avatarUrl = await uploadImage(selectedAvatarFile);
      }

      const updatedProfile = {
        name: formData.name,
        avatar: avatarUrl,
        image: avatarUrl,
        photoURL: avatarUrl,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      };

      await updateUserProfile(updatedProfile);

      if (refreshSession) {
        await refreshSession();
      }

      setPreviewUrl(avatarUrl);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="sc-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">person</span>
            </span>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                My Profile
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Manage your profile information
              </h1>

              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
                View and update your name, avatar, address, blood group and
                profile details. Email address always stays read-only.
              </p>
            </div>
          </div>

          {isEditing ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-surface-border bg-white px-6 py-3 text-sm font-extrabold text-ink transition hover:bg-surface-soft"
            >
              <span className="material-symbols-rounded">close</span>
              Cancel Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="sc-primary-btn justify-center px-6 py-3"
            >
              <span className="material-symbols-rounded">edit</span>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="sc-card p-6 text-center sm:p-8">
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-[34px] bg-primary-tint">
          <img
            src={previewUrl || currentAvatar}
            alt={profileUser.name || "User avatar"}
            className="h-full w-full object-cover"
          />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
          {profileUser.name || profileUser.displayName || "Scaffold User"}
        </h2>

        <p className="mt-1 text-sm font-semibold text-ink-muted">
          {profileUser.email}
        </p>

        <div className="mt-4 flex justify-center gap-2">
          <span className="rounded-full bg-primary-tint px-4 py-2 text-xs font-extrabold capitalize text-primary">
            {profileUser.role || "donor"}
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-extrabold capitalize text-green-700">
            {profileUser.status || "active"}
          </span>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-[24px] border border-surface-border bg-white p-5 text-left">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Profile Rule
          </p>

          <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
            Click edit to update your profile information. Email address will
            stay locked for account security.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleProfileUpdate)} className="sc-card">
        <div className="flex flex-col gap-4 border-b border-surface-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Profile Form
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              {isEditing
                ? "Edit mode is active. Update your information and save."
                : "Profile information is locked. Click edit profile to update."}
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold text-amber-700">
            {isEditing ? "Editable" : "Read Only"}
          </span>
        </div>

        <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
          <div>
            <label className="sc-label">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              className="sc-input mt-2 disabled:bg-surface-soft"
              {...register("name", { required: "Name is required." })}
            />
            {errors.name ? <FormError message={errors.name.message} /> : null}
          </div>

          <div>
            <label className="sc-label">Email Address</label>
            <input
              type="email"
              disabled
              className="sc-input mt-2 bg-surface-soft"
              {...register("email")}
            />
          </div>

          <div className="md:col-span-2">
            <label className="sc-label">Avatar Image</label>

            <div className="mt-2 flex flex-col gap-4 rounded-[24px] border border-surface-border bg-white p-4 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[24px] bg-primary-tint">
                <img
                  src={previewUrl || currentAvatar}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  disabled={!isEditing}
                  className="block w-full cursor-pointer rounded-[18px] border border-surface-border bg-surface-soft px-4 py-3 text-sm font-semibold text-ink-muted file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  {...register("avatarFile", {
                    onChange: handleAvatarPreview,
                  })}
                />

                <p className="mt-2 text-xs font-semibold text-ink-muted">
                  Upload a new avatar image. It will be uploaded to imgBB and
                  saved as your profile avatar URL.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="sc-label">Blood Group</label>
            <select
              disabled={!isEditing}
              className="sc-select mt-2 disabled:bg-surface-soft"
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
            <label className="sc-label">Role</label>
            <input
              type="text"
              disabled
              className="sc-input mt-2 bg-surface-soft capitalize"
              {...register("role")}
            />
          </div>

          <div>
            <label className="sc-label">District</label>
            <select
              disabled={!isEditing || locationLoading}
              className="sc-select mt-2 disabled:bg-surface-soft"
              {...register("district", {
                required: "District is required.",
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
            {errors.district ? (
              <FormError message={errors.district.message} />
            ) : null}
          </div>

          <div>
            <label className="sc-label">Upazila</label>
            <select
              disabled={!isEditing || !selectedDistrictName || locationLoading}
              className="sc-select mt-2 disabled:bg-surface-soft"
              {...register("upazila", {
                required: "Upazila is required.",
              })}
            >
              <option value="">
                {selectedDistrictName ? "Select upazila" : "Select district first"}
              </option>

              {upazilaOptions.map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name}
                </option>
              ))}
            </select>
            {errors.upazila ? (
              <FormError message={errors.upazila.message} />
            ) : null}
          </div>
        </div>

        {isEditing ? (
          <div className="flex justify-end border-t border-surface-border p-6">
            <button
              type="submit"
              disabled={isSaving}
              className="sc-primary-btn px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-rounded">save</span>
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        ) : null}
      </form>
    </section>
  );
};

const FormError = ({ message }) => {
  return <p className="mt-2 text-xs font-bold text-state-danger">{message}</p>;
};

export default Profile;