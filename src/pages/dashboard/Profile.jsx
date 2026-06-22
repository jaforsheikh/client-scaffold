import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import uploadImage from "../../api/uploadImage";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS, DEFAULT_AVATAR } from "../../utils/constants";

const Profile = () => {
  const { user, dbUser, refreshSession } = useAuth();
  const { districts, getUpazilasByDistrict, loading: locationLoading } =
    useLocationData();

  const [profileUser, setProfileUser] = useState(dbUser || user);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const loadProfile = async () => {
    setLoading(true);

    try {
      const { data } = await axiosPublic.get("/api/users/me");
      const currentUser = data?.user || dbUser || user;

      setProfileUser(currentUser);

      reset({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        bloodGroup: currentUser?.bloodGroup || "",
        district: currentUser?.district || "",
        upazila: currentUser?.upazila || "",
      });
    } catch (error) {
      const currentUser = dbUser || user;

      setProfileUser(currentUser);

      reset({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        bloodGroup: currentUser?.bloodGroup || "",
        district: currentUser?.district || "",
        upazila: currentUser?.upazila || "",
      });

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [dbUser?.email, user?.email]);

  const handleDistrictChange = () => {
    resetField("upazila");
  };

  const handleProfileUpdate = async (formData) => {
    setIsSaving(true);

    try {
      let avatarUrl =
        profileUser?.avatar ||
        profileUser?.image ||
        profileUser?.photoURL ||
        "";

      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      await axiosPublic.patch("/api/users/me", {
        name: formData.name,
        avatar: avatarUrl,
        image: avatarUrl,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      });

      await refreshSession?.();
      await loadProfile();

      setAvatarFile(null);
      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Profile update failed."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <Loader />
      </section>
    );
  }

  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : profileUser?.avatar ||
      profileUser?.image ||
      profileUser?.photoURL ||
      DEFAULT_AVATAR;

  return (
    <section className="space-y-8">
      <div className="sc-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <img
              src={avatarPreview}
              alt={profileUser?.name || "Profile avatar"}
              className="h-24 w-24 rounded-[32px] border border-surface-border object-cover shadow-sm"
            />

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                My Profile
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {profileUser?.name || "Profile User"}
              </h1>

              <p className="mt-2 text-sm font-semibold text-ink-muted">
                {profileUser?.email}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <Button icon="edit" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button
              icon="close"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setAvatarFile(null);
                loadProfile();
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleProfileUpdate)}
        className="sc-card p-6 sm:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="sc-label">Avatar</label>

            <input
              type="file"
              accept="image/*"
              disabled={!isEditing}
              onChange={(event) => setAvatarFile(event.target.files?.[0])}
              className="file-input file-input-bordered mt-2 w-full rounded-[20px] border-surface-border bg-white font-semibold disabled:cursor-not-allowed disabled:bg-surface-soft"
            />

            <p className="mt-2 text-xs font-semibold text-ink-muted">
              Upload image through ImgBB. Leave empty if you do not want to
              change avatar.
            </p>
          </div>

          <div>
            <label className="sc-label">Name</label>
            <input
              type="text"
              disabled={!isEditing}
              className="sc-input mt-2 disabled:bg-surface-soft"
              {...register("name", {
                required: "Name is required.",
              })}
            />
            {errors.name ? <FormError message={errors.name.message} /> : null}
          </div>

          <div>
            <label className="sc-label">Email</label>
            <input
              type="email"
              readOnly
              className="sc-input mt-2 bg-surface-soft"
              {...register("email")}
            />
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
            {errors.upazila ? (
              <FormError message={errors.upazila.message} />
            ) : null}
          </div>

          <div>
            <label className="sc-label">Role</label>
            <input
              type="text"
              readOnly
              value={profileUser?.role || "donor"}
              className="sc-input mt-2 bg-surface-soft capitalize"
            />
          </div>

          <div>
            <label className="sc-label">Status</label>
            <input
              type="text"
              readOnly
              value={profileUser?.status || "active"}
              className="sc-input mt-2 bg-surface-soft capitalize"
            />
          </div>
        </div>

        {isEditing ? (
          <div className="mt-8 flex justify-end">
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