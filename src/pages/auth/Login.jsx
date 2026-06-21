import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await loginUser(email, password);
      toast.success("Logged in successfully.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-surface-page py-12 sm:py-16">
      <div className="sc-container">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[34px] border border-surface-border bg-white shadow-card lg:grid-cols-[.95fr_1.05fr]">
          <div className="p-6 sm:p-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">login</span>
            </span>

            <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Donor Login
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Login to your Scaffold account
            </h1>

            <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-ink-muted">
              Access your dashboard, manage donation requests, and respond to
              blood donation support safely.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="sc-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="sc-input mt-2"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="sc-label">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="sc-input mt-2"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="sc-primary-btn w-full justify-center px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-rounded">login</span>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-ink-muted">
              New to Scaffold?{" "}
              <Link to="/register" className="font-extrabold text-primary">
                Register
              </Link>
            </p>
          </div>

          <div className="hidden bg-ink p-10 text-white lg:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/45">
              Secure Access
            </p>

            <h2 className="mt-4 max-w-lg text-4xl font-extrabold tracking-tight">
              Your dashboard helps coordinate blood donation support faster.
            </h2>

            <p className="mt-5 max-w-lg text-base font-semibold leading-8 text-white/60">
              Login securely to track requests, donor information, profile
              details, funding activity and role-based dashboard access.
            </p>

            <div className="mt-10 space-y-4">
              <LoginFeature icon="shield" title="Secure Session Login" />
              <LoginFeature icon="dashboard" title="Role Based Dashboard" />
              <LoginFeature icon="bloodtype" title="Donation Request Access" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LoginFeature = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-4 rounded-[24px] bg-white/10 p-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary text-white">
        <span className="material-symbols-rounded">{icon}</span>
      </span>
      <p className="text-sm font-extrabold">{title}</p>
    </div>
  );
};

export default Login;