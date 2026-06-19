import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";
import axiosPublic from "../../api/axiosPublic";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS, DEFAULT_AVATAR } from "../../utils/constants";

const Register = () => {
  const { user, createUser, updateUserProfile, loading } = useAuth();
  const { districts, loading: locationLoading, getUpazilasByDistrict } =
    useLocationData();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      bloodGroup: "",
      districtId: "",
      upazilaId: "",
      password: "",
    },
  });

  const selectedDistrictId = watch("districtId");

  const filteredUpazilas = useMemo(
    () => getUpazilasByDistrict(selectedDistrictId),
    [getUpazilasByDistrict, selectedDistrictId]
  );

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    const selectedDistrict = districts.find(
      (district) => String(district.id) === String(data.districtId)
    );

    const selectedUpazila = filteredUpazilas.find(
      (upazila) => String(upazila.id) === String(data.upazilaId)
    );

    try {
      const result = await createUser(data.email, data.password);

      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL || DEFAULT_AVATAR,
      });

      const userInfo = {
        name: data.name,
        email: data.email,
        avatar: data.photoURL || DEFAULT_AVATAR,
        bloodGroup: data.bloodGroup,
        district: selectedDistrict?.name || "",
        districtId: data.districtId,
        upazila: selectedUpazila?.name || "",
        upazilaId: data.upazilaId,
        role: "donor",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      try {
        await axiosPublic.post("/users", userInfo);
      } catch {
        console.log("Backend user save will be connected later:", userInfo);
      }

      if (result?.user?.email) {
        toast.success("Account created successfully.");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      const message =
        error?.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : "Registration failed. Please check your information.";

      toast.error(message);
    }
  };

  return (
    <section className="min-h-[calc(100vh-76px)] bg-surface-page py-10 sm:py-14">
      <div className="sc-container grid min-h-[760px] items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="sc-card p-6 sm:p-8 lg:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
            <span className="material-symbols-rounded text-4xl">
              person_add
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Create your donor account
          </h1>

          <p className="mt-3 text-base font-semibold leading-7 text-ink-muted">
            Register as a donor with accurate blood group and location
            information.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="sc-label">Full Name</label>
                <input
                  type="text"
                  className="sc-input mt-2"
                  placeholder="Enter your full name"
                  {...register("name", {
                    required: "Full name is required.",
                  })}
                />
                <FormError message={errors.name?.message} />
              </div>

              <div>
                <label className="sc-label">Email Address</label>
                <input
                  type="email"
                  className="sc-input mt-2"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email address is required.",
                  })}
                />
                <FormError message={errors.email?.message} />
              </div>

              <div className="sm:col-span-2">
                <label className="sc-label">Photo URL</label>
                <input
                  type="url"
                  className="sc-input mt-2"
                  placeholder="Enter photo URL"
                  {...register("photoURL")}
                />
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
                <label className="sc-label">District</label>
                <select
                  className="sc-select mt-2"
                  disabled={locationLoading}
                  {...register("districtId", {
                    required: "District is required.",
                  })}
                >
                  <option value="">
                    {locationLoading ? "Loading districts..." : "Select district"}
                  </option>

                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                <FormError message={errors.districtId?.message} />
              </div>

              <div>
                <label className="sc-label">Upazila</label>
                <select
                  className="sc-select mt-2"
                  disabled={!selectedDistrictId || locationLoading}
                  {...register("upazilaId", {
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
                <FormError message={errors.upazilaId?.message} />
              </div>

              <div>
                <label className="sc-label">Password</label>
                <input
                  type="password"
                  className="sc-input mt-2"
                  placeholder="Create password"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters.",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                      message:
                        "Password must include at least one uppercase and one lowercase letter.",
                    },
                  })}
                />
                <FormError message={errors.password?.message} />
              </div>
            </div>

            <Button
              type="submit"
              icon="person_add"
              loading={isSubmitting}
              className="w-full"
            >
              Register
            </Button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-ink-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-extrabold text-primary">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-[36px] bg-ink p-8 text-white shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/50">
              Donor Registration
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight">
              Your donor profile helps requesters find support faster.
            </h2>

            <p className="mt-4 text-base font-semibold leading-8 text-white/60">
              Accurate blood group, district and upazila information improves
              donor search and emergency request matching.
            </p>

            <div className="mt-8 grid gap-4">
              <Feature icon="bloodtype" title="Blood Group Matching" />
              <Feature icon="location_on" title="District & Upazila Based Search" />
              <Feature icon="verified_user" title="Default Donor Access" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/10 p-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-primary text-white">
        <span className="material-symbols-rounded">{icon}</span>
      </span>

      <p className="font-extrabold">{title}</p>
    </div>
  );
};

export default Register;