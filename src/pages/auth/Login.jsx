import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { user, loginUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      toast.success("Logged in successfully.");
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error?.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : "Login failed. Please try again.";

      toast.error(message);
    }
  };

  return (
    <section className="min-h-[calc(100vh-76px)] bg-surface-page py-10 sm:py-14">
      <div className="sc-container grid min-h-[680px] items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div className="sc-card p-6 sm:p-8 lg:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
            <span className="material-symbols-rounded text-4xl">login</span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Welcome back to Scaffold
          </h1>

          <p className="mt-3 text-base font-semibold leading-7 text-ink-muted">
            Login with your registered email and password to access your private
            dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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

            <div>
              <label className="sc-label">Password</label>
              <input
                type="password"
                className="sc-input mt-2"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required.",
                })}
              />
              <FormError message={errors.password?.message} />
            </div>

            <Button
              type="submit"
              icon="lock_open"
              loading={isSubmitting}
              className="w-full"
            >
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-ink-muted">
            New to Scaffold?{" "}
            <Link to="/register" className="font-extrabold text-primary">
              Create an account
            </Link>
          </p>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-[36px] bg-ink p-8 text-white shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/50">
              Secure Access
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight">
              Manage donation requests from one trusted dashboard.
            </h2>

            <p className="mt-4 text-base font-semibold leading-8 text-white/60">
              Donors, volunteers and admins can use role-based access to manage
              blood donation activity safely.
            </p>

            <div className="mt-8 grid gap-4">
              <Feature icon="dashboard" title="Private Dashboard" />
              <Feature icon="verified_user" title="Role Based Access" />
              <Feature icon="bloodtype" title="Donation Request Management" />
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

export default Login;