import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user, dbUser } = useAuth();

  const profile = {
    name: dbUser?.name || user?.displayName || "Scaffold User",
    email: dbUser?.email || user?.email || "Not available",
    avatar: dbUser?.avatar || user?.photoURL || "",
    bloodGroup: dbUser?.bloodGroup || "A+",
    district: dbUser?.district || "Not added",
    upazila: dbUser?.upazila || "Not added",
    role: dbUser?.role || "donor",
    status: dbUser?.status || "active",
    phone: dbUser?.phone || "Not added",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Profile"
        title="Manage your donor identity"
        description="Keep your personal details accurate so requesters and admins can verify your donor profile quickly."
        icon="person"
        action={
          <Button icon="edit" variant="secondary">
            Edit Profile
          </Button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[.75fr_1.25fr]">
        <div className="sc-card p-6 text-center sm:p-8">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[34px] bg-primary-tint text-primary shadow-card">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="material-symbols-rounded text-6xl">person</span>
            )}
          </div>

          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
            {profile.name}
          </h2>

          <p className="mt-1 text-sm font-semibold text-ink-muted">
            {profile.email}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <BloodBadge group={profile.bloodGroup} size="sm" />
            <StatusBadge status={profile.role} />
            <StatusBadge status={profile.status} />
          </div>

          <div className="mt-8 rounded-[24px] border border-surface-border bg-surface-soft p-5 text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Donor Location
            </p>

            <div className="mt-4 grid gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary">
                  <span className="material-symbols-rounded">location_on</span>
                </span>

                <div>
                  <p className="text-xs font-bold text-ink-muted">District</p>
                  <p className="font-extrabold text-ink">{profile.district}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary">
                  <span className="material-symbols-rounded">map</span>
                </span>

                <div>
                  <p className="text-xs font-bold text-ink-muted">Upazila</p>
                  <p className="font-extrabold text-ink">{profile.upazila}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Profile Information
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              Your account details and platform access information.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <InfoCard icon="badge" label="Full Name" value={profile.name} />
            <InfoCard icon="mail" label="Email Address" value={profile.email} />
            <InfoCard icon="call" label="Phone Number" value={profile.phone} />
            <InfoCard
              icon="bloodtype"
              label="Blood Group"
              value={profile.bloodGroup}
            />
            <InfoCard icon="admin_panel_settings" label="Role" value={profile.role} />
            <InfoCard icon="verified" label="Status" value={profile.status} />
            <InfoCard icon="location_city" label="District" value={profile.district} />
            <InfoCard icon="pin_drop" label="Upazila" value={profile.upazila} />
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[24px] border border-surface-border bg-surface-soft p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-white text-primary shadow-sm">
          <span className="material-symbols-rounded">{icon}</span>
        </span>

        <div className="min-w-0">
          <p className="text-xs font-bold text-ink-muted">{label}</p>
          <p className="truncate text-sm font-extrabold capitalize text-ink">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;