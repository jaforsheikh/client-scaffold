import { Link } from "react-router-dom";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import SectionTitle from "../../components/common/SectionTitle";
import StatusBadge from "../../components/common/StatusBadge";
import { recentDonationRequests } from "../../data/dashboardMockData";
import { formatDate } from "../../utils/dateFormatter";

const Home = () => {
  return (
    <div className="bg-surface-page">
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />

        <div className="sc-container relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary shadow-sm">
              <span className="material-symbols-rounded text-base">
                favorite
              </span>
              Trusted Blood Donation Network
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Find blood donors faster when every second matters.
            </h1>

            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-ink-muted sm:text-lg">
              Scaffold connects donors, requesters, volunteers and admins in one
              secure platform for emergency blood donation support.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/search">
                <Button icon="search" size="lg">
                  Search Donors
                </Button>
              </Link>

              <Link to="/donation-requests">
                <Button icon="volunteer_activism" size="lg" variant="secondary">
                  View Requests
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <HeroStat value="500+" label="Donors Network" />
              <HeroStat value="24/7" label="Emergency Support" />
              <HeroStat value="8" label="Blood Groups" />
            </div>
          </div>

          <div className="sc-card relative overflow-hidden p-5 sm:p-6">
            <div className="rounded-[30px] bg-ink p-5 text-white sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/50">
                    Live Request Board
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                    Urgent Blood Needs
                  </h2>
                </div>

                <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary text-white">
                  <span className="material-symbols-rounded text-4xl">
                    bloodtype
                  </span>
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {recentDonationRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-[24px] border border-white/10 bg-white/10 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-extrabold">
                          {request.recipientName}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white/60">
                          {request.hospitalName}
                        </p>
                      </div>

                      <BloodBadge group={request.bloodGroup} size="sm" />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-white/60">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-rounded text-base">
                          location_on
                        </span>
                        {request.district}, {request.upazila}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-rounded text-base">
                          event
                        </span>
                        {formatDate(request.donationDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="sc-container">
          <SectionTitle
            eyebrow="How It Works"
            title="Simple steps to create impact"
            description="A clean workflow for requesters, donors, volunteers and admins."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <ProcessCard
              number="01"
              icon="person_add"
              title="Create an account"
              description="Register as a donor and keep your blood group, district and upazila updated."
            />
            <ProcessCard
              number="02"
              icon="assignment_add"
              title="Submit request"
              description="Requesters can submit hospital, recipient, date and emergency details."
            />
            <ProcessCard
              number="03"
              icon="verified"
              title="Track progress"
              description="Volunteers and admins can manage request status and support faster coordination."
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="sc-container">
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="sc-card p-6 sm:p-8">
              <span className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
                <span className="material-symbols-rounded text-4xl">
                  health_and_safety
                </span>
              </span>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
                Built for safe and organized blood donation support.
              </h2>

              <p className="mt-4 text-base font-semibold leading-7 text-ink-muted">
                Scaffold keeps donor search, request management, funding support
                and role-based dashboards organized in one responsive platform.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <StatusBadge status="donor" />
                <StatusBadge status="volunteer" />
                <StatusBadge status="admin" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FeatureCard
                icon="search"
                title="Donor Search"
                description="Search donors by blood group, district and upazila."
              />
              <FeatureCard
                icon="assignment"
                title="Request Management"
                description="Create and monitor blood donation requests."
              />
              <FeatureCard
                icon="admin_panel_settings"
                title="Role Dashboard"
                description="Separate access for donor, volunteer and admin."
              />
              <FeatureCard
                icon="payments"
                title="Funding Support"
                description="Stripe-ready funding page for platform support."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="sc-container">
          <div className="rounded-[34px] bg-ink p-8 text-center text-white shadow-card sm:p-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/50">
              Join The Mission
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              One donor can save a life. Your profile can make the difference.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-white/60">
              Register today and help requesters find the right donor faster
              during urgent blood donation situations.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/register">
                <Button icon="person_add" size="lg">
                  Become a Donor
                </Button>
              </Link>

              <Link to="/funding">
                <Button icon="volunteer_activism" size="lg" variant="secondary">
                  Support Funding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const HeroStat = ({ value, label }) => {
  return (
    <div className="rounded-[24px] border border-surface-border bg-white p-5 shadow-sm">
      <h3 className="text-3xl font-extrabold tracking-tight text-primary">
        {value}
      </h3>
      <p className="mt-1 text-sm font-bold text-ink-muted">{label}</p>
    </div>
  );
};

const ProcessCard = ({ number, icon, title, description }) => {
  return (
    <div className="sc-card p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-extrabold text-primary">{number}</span>
        <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary-tint text-primary">
          <span className="material-symbols-rounded text-3xl">{icon}</span>
        </span>
      </div>

      <h3 className="mt-6 text-xl font-extrabold tracking-tight text-ink">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold leading-6 text-ink-muted">
        {description}
      </p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="sc-card p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary-tint text-primary">
        <span className="material-symbols-rounded text-3xl">{icon}</span>
      </span>

      <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold leading-6 text-ink-muted">
        {description}
      </p>
    </div>
  );
};

export default Home;