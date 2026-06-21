import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS } from "../../utils/constants";

const Register = () => {
  const { createUser } = useAuth();
  const { districts, getUpazilasByDistrict, loading: locationLoading } =
    useLocationData();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const selectedDistrictName = useWatch({
    control,
    name: "district",
  });

  const selectedDistrict = useMemo(
    () =>
      districts.find(
        (district) => district.name === selectedDistrictName
      ),
    [districts, selectedDistrictName]
  );

  const upazilaOptions = useMemo(() => {
    if (!selectedDistrict?.id) return [];
    return getUpazilasByDistrict(selectedDistrict.id);
  }, [selectedDistrict, getUpazilasByDistrict]);

  const handleDistrictChange = () => {
    resetField("upazila");
  };

  const handleRegister = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser(formData.email, formData.password, {
        name: formData.name,
        avatar: formData.avatar,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      });

      toast.success("Registration successful.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-surface-page py-12 sm:py-16">
      <div className="sc-container">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[34px] border border-surface-border bg-white shadow-card lg:grid-cols-[1.05fr_.95fr]">
          <div className="p-6 sm:p-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">
                person_add
              </span>
            </span>

            <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Donor Registration
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Create your donor account
            </h1>

            <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-ink-muted">
              Register as a donor with accurate blood group and location
              information.
            </p>

            <form
              onSubmit={handleSubmit(handleRegister)}
              className="mt-8 grid gap-5 sm:grid-cols-2"
            >
              <div>
                <label className="sc-label">Full Name</label>
                <input
                  type="text"
                  className="sc-input mt-2"
                  placeholder="Enter your full name"
                  {...register("name", { required: "Name is required." })}
                />
                {errors.name ? <FormError message={errors.name.message} /> : null}
              </div>

              <div>
                <label className="sc-label">Email Address</label>
                <input
                  type="email"
                  className="sc-input mt-2"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required." })}
                />
                {errors.email ? (
                  <FormError message={errors.email.message} />
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="sc-label">Avatar / Photo URL</label>
                <input
                  type="url"
                  className="sc-input mt-2"
                  placeholder="Enter avatar URL"
                  {...register("avatar")}
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
                {errors.bloodGroup ? (
                  <FormError message={errors.bloodGroup.message} />
                ) : null}
              </div>

              <div>
                <label className="sc-label">District</label>
                <select
                  className="sc-select mt-2"
                  disabled={locationLoading}
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
                  className="sc-select mt-2"
                  disabled={!selectedDistrictName || locationLoading}
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
                <label className="sc-label">Password</label>
                <input
                  type="password"
                  className="sc-input mt-2"
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters.",
                    },
                  })}
                />
                {errors.password ? (
                  <FormError message={errors.password.message} />
                ) : null}
              </div>

              <div>
                <label className="sc-label">Confirm Password</label>
                <input
                  type="password"
                  className="sc-input mt-2"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required.",
                  })}
                />
                {errors.confirmPassword ? (
                  <FormError message={errors.confirmPassword.message} />
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sc-primary-btn w-full justify-center px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-rounded">person_add</span>
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-ink-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-extrabold text-primary">
                Login
              </Link>
            </p>
          </div>

          <div className="hidden bg-ink p-10 text-white lg:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/45">
              Donor Registration
            </p>

            <h2 className="mt-4 max-w-lg text-4xl font-extrabold tracking-tight">
              Your donor profile helps requesters find support faster.
            </h2>

            <p className="mt-5 max-w-lg text-base font-semibold leading-8 text-white/60">
              Accurate blood group, district and upazila information improves
              donor search and emergency request matching.
            </p>

            <div className="mt-10 space-y-4">
              <RegisterFeature icon="bloodtype" title="Blood Group Matching" />
              <RegisterFeature
                icon="location_on"
                title="District & Upazila Based Search"
              />
              <RegisterFeature icon="verified_user" title="Default Donor Access" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FormError = ({ message }) => {
  return <p className="mt-2 text-xs font-bold text-state-danger">{message}</p>;
};

const RegisterFeature = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-4 rounded-[24px] bg-white/10 p-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary text-white">
        <span className="material-symbols-rounded">{icon}</span>
      </span>
      <p className="text-sm font-extrabold">{title}</p>
    </div>
  );
};

export default Register;