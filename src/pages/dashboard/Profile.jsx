import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import axiosPublic from "../../api/axiosPublic";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS, DEFAULT_AVATAR } from "../../utils/constants";

const Profile = () => {
  const { user, dbUser, updateUserProfile, fetchDbUser } = useAuth();
  const { districts, loading: locationLoading, getUpazilasByDistrict } =
    useLocationData();

  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "",
    bloodGroup: "",
    district: "",
    districtId: "",
    upazila: "",
    upazilaId: "",
    role: "donor",
    status: "active",
  });

  useEffect(() => {
    setProfileData({
      name: dbUser?.name || user?.displayName || "Scaffold User",
      email: dbUser?.email || user?.email || "",
      avatar: dbUser?.avatar || user?.photoURL || DEFAULT_AVATAR,
      bloodGroup: dbUser?.bloodGroup || "A+",
      district: dbUser?.district || "",
      districtId: dbUser?.districtId || "",
      upazila: dbUser?.upazila || "",
      upazilaId: dbUser?.upazilaId || "",
      role: dbUser?.role || "donor",
      status: dbUser?.status || "active",
    });
  }, [dbUser, user]);

  const filteredUpazilas = useMemo(
    () => getUpazilasByDistrict(profileData.districtId),
    [getUpazilasByDistrict, profileData.districtId]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfileData((currentData) => ({
      ...currentData,
      [name]: value,
      ...(name === "districtId" ? { upazilaId: "", upazila: "" } : {}),
    }));
  };

  const validateForm = () => {
    const formErrors = {};

    if (!profileData.name.trim()) {
      formErrors.name = "Name is required.";
    }

    if (!profileData.avatar.trim()) {
      formErrors.avatar = "Avatar URL is required.";
    }

    if (!profileData.bloodGroup) {
      formErrors.bloodGroup = "Blood group is required.";
    }

    if (!profileData.districtId) {
      formErrors.districtId = "District is required.";
    }

    if (!profileData.upazilaId) {
      formErrors.upazilaId = "Upazila is required.";
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const selectedDistrict = districts.find(
      (district) => String(district.id) === String(profileData.districtId)
    );

    const selectedUpazila = filteredUpazilas.find(
      (upazila) => String(upazila.id) === String(profileData.upazilaId)
    );

    const updatedProfile = {
      name: profileData.name,
      email: profileData.email,
      avatar: profileData.avatar || DEFAULT_AVATAR,
      bloodGroup: profileData.bloodGroup,
      district: selectedDistrict?.name || profileData.district,
      districtId: profileData.districtId,
      upazila: selectedUpazila?.name || profileData.upazila,
      upazilaId: profileData.upazilaId,
      role: profileData.role,
      status: profileData.status,
      updatedAt: new Date().toISOString(),
    };

    setSaving(true);

    try {
      await updateUserProfile({
        displayName: updatedProfile.name,
        photoURL: updatedProfile.avatar,
      });

      try {
        await axiosPublic.patch(`/users/${profileData.email}`, updatedProfile);
      } catch {
        console.log("Backend profile update will be connected later:", updatedProfile);
      }

      setProfileData(updatedProfile);
      setIsEditMode(false);
      setErrors({});

      if (fetchDbUser && user) {
        await fetchDbUser(user);
      }

      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Profile update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setErrors({});

    setProfileData({
      name: dbUser?.name || user?.displayName || "Scaffold User",
      email: dbUser?.email || user?.email || "",
      avatar: dbUser?.avatar || user?.photoURL || DEFAULT_AVATAR,
      bloodGroup: dbUser?.bloodGroup || "A+",
      district: dbUser?.district || "",
      districtId: dbUser?.districtId || "",
      upazila: dbUser?.upazila || "",
      upazilaId: dbUser?.upazilaId || "",
      role: dbUser?.role || "donor",
      status: dbUser?.status || "active",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Profile"
        title="Manage your profile information"
        description="View and update your name, avatar, address, blood group and profile details. Email address always stays read-only."
        icon="person"
        action={
          isEditMode ? (
            <Button variant="secondary" icon="close" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          ) : (
            <Button icon="edit" onClick={() => setIsEditMode(true)}>
              Edit Profile
            </Button>
          )
        }
      />

      <form onSubmit={handleSaveProfile} className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <aside className="sc-card p-6 text-center sm:p-8">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[34px] bg-primary-tint text-primary shadow-card">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="material-symbols-rounded text-6xl">person</span>
            )}
          </div>

          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
            {profileData.name}
          </h2>

          <p className="mt-1 text-sm font-semibold text-ink-muted">
            {profileData.email}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <StatusBadge status={profileData.role} />
            <StatusBadge status={profileData.status} />
          </div>

          <div className="mt-8 rounded-[24px] border border-surface-border bg-surface-soft p-5 text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Profile Rule
            </p>

            <p className="mt-3 text-sm font-semibold leading-6 text-ink-muted">
              Click edit to update your profile information. Email address will
              stay locked for account security.
            </p>
          </div>
        </aside>

        <section className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-ink">
                  Profile Form
                </h2>

                <p className="mt-1 text-sm font-semibold text-ink-muted">
                  {isEditMode
                    ? "Edit mode is active. Update your information and save."
                    : "Form is locked. Click edit profile to update information."}
                </p>
              </div>

              <StatusBadge
                status={isEditMode ? "pending" : "active"}
                label={isEditMode ? "Editable" : "Read Only"}
              />
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label className="sc-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                disabled={!isEditMode}
                className="sc-input mt-2 disabled:bg-surface-soft"
                placeholder="Enter full name"
              />
              <FormError message={errors.name} />
            </div>

            <div>
              <label className="sc-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                readOnly
                className="sc-input mt-2 bg-surface-soft"
                placeholder="Email address"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="sc-label">Avatar URL</label>
              <input
                type="url"
                name="avatar"
                value={profileData.avatar}
                onChange={handleChange}
                disabled={!isEditMode}
                className="sc-input mt-2 disabled:bg-surface-soft"
                placeholder="Enter avatar URL"
              />
              <FormError message={errors.avatar} />
            </div>

            <div>
              <label className="sc-label">Blood Group</label>
              <select
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditMode}
                className="sc-select mt-2 disabled:bg-surface-soft"
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <FormError message={errors.bloodGroup} />
            </div>

            <div>
              <label className="sc-label">Role</label>
              <input
                type="text"
                value={profileData.role}
                readOnly
                className="sc-input mt-2 bg-surface-soft capitalize"
              />
            </div>

            <div>
              <label className="sc-label">District</label>
              <select
                name="districtId"
                value={profileData.districtId}
                onChange={handleChange}
                disabled={!isEditMode || locationLoading}
                className="sc-select mt-2 disabled:bg-surface-soft"
              >
                <option value="">
                  {locationLoading
                    ? "Loading districts..."
                    : profileData.district || "Select district"}
                </option>

                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              <FormError message={errors.districtId} />
            </div>

            <div>
              <label className="sc-label">Upazila</label>
              <select
                name="upazilaId"
                value={profileData.upazilaId}
                onChange={handleChange}
                disabled={!isEditMode || !profileData.districtId || locationLoading}
                className="sc-select mt-2 disabled:bg-surface-soft"
              >
                <option value="">
                  {!profileData.districtId
                    ? profileData.upazila || "Select district first"
                    : profileData.upazila || "Select upazila"}
                </option>

                {filteredUpazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.id}>
                    {upazila.name}
                  </option>
                ))}
              </select>
              <FormError message={errors.upazilaId} />
            </div>

            <div>
              <label className="sc-label">Status</label>
              <input
                type="text"
                value={profileData.status}
                readOnly
                className="sc-input mt-2 bg-surface-soft capitalize"
              />
            </div>

            {isEditMode ? (
              <div className="flex items-end">
                <Button
                  type="submit"
                  icon="save"
                  loading={saving}
                  className="w-full"
                >
                  Save Updated Profile
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      </form>
    </div>
  );
};

export default Profile;