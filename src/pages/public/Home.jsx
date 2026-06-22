import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import SectionTitle from "../../components/common/SectionTitle";
import StatusBadge from "../../components/common/StatusBadge";

const HERO_IMAGE = "/images/hero-blood-donation.png";

const faqItems = [
  {
    question: "Who can register as a blood donor?",
    answer:
      "Anyone who is eligible, healthy, and willing to support emergency blood donation requests can register as a donor.",
  },
  {
    question: "How can I search for blood donors?",
    answer:
      "Use the Search Donors page and select blood group, district, and upazila. Donor results will show only after clicking the search button.",
  },
  {
    question: "Can I create a blood donation request?",
    answer:
      "Yes. Logged-in active users can create donation requests from the dashboard with recipient, hospital, location, blood group, date, time, and message.",
  },
  {
    question: "Can blocked users create donation requests?",
    answer:
      "No. Blocked users cannot create blood donation requests until an admin changes their account status to active.",
  },
  {
    question: "Who can update donation request status?",
    answer:
      "Volunteers and admins can update request status. Donors can mark their own in-progress requests as done or canceled.",
  },
  {
    question: "What information is shown on a donation request details page?",
    answer:
      "The details page shows requester information, recipient information, hospital name, full address, blood group, date, time, message, and current request status.",
  },
  {
    question: "How does the funding page work?",
    answer:
      "Logged-in users can access the funding page, view funding history, and use the Give Fund button with Stripe-ready payment UI.",
  },
  {
    question: "Is Scaffold mobile responsive?",
    answer:
      "Yes. The layout is designed to work across desktop, tablet, and mobile screens with responsive navigation and dashboard pages.",
  },
];

const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleContactSubmit = (event) => {
    event.preventDefault();
    toast.success("Message submitted successfully.");
    event.target.reset();
  };

  return (
    <div className="bg-surface-page">
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />

        <div className="sc-container relative grid items-center gap-10 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary shadow-sm">
              <span className="material-symbols-rounded text-base">
                favorite
              </span>
              Trusted Blood Donor Organization
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Find blood donors faster when every second matters.
            </h1>

            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-ink-muted sm:text-lg">
              Scaffold connects donors, requesters, volunteers and admins in one
              secure platform for emergency blood donation support.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button icon="person_add" size="lg">
                  Join as a donor
                </Button>
              </Link>

              <Link to="/search">
                <Button icon="search" size="lg" variant="secondary">
                  Search Donors
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <HeroStat value="500+" label="Donors Network" />
              <HeroStat value="24/7" label="Emergency Support" />
              <HeroStat value="8" label="Blood Groups" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-8 right-8 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[36px] border border-surface-border bg-white p-3 shadow-card sm:p-4">
              <img
                src={HERO_IMAGE}
                alt="Blood donation support dashboard"
                className="block aspect-square w-full rounded-[30px] object-cover"
                loading="eager"
              />
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
          <SectionTitle
            eyebrow="FAQ"
            title="Common questions about"
            highlight="Scaffold"
            description="Quick answers about donor search, donation requests, role access, funding, and account safety."
          />

          <div className="mx-auto mt-10 max-w-4xl space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={item.question}
                number={String(index + 1).padStart(2, "0")}
                question={item.question}
                answer={item.answer}
                isOpen={openFaqIndex === index}
                onToggle={() =>
                  setOpenFaqIndex(openFaqIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="sc-container">
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="sc-card p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Contact Us
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">
                Need help with blood donation support?
              </h2>

              <p className="mt-4 text-base font-semibold leading-7 text-ink-muted">
                Contact our support team for donor coordination, request
                assistance, or platform-related questions.
              </p>

              <div className="mt-8 space-y-4">
                <ContactInfo
                  icon="call"
                  label="Contact Number"
                  value="+880 1700-000000"
                />

                <ContactInfo
                  icon="mail"
                  label="Support Email"
                  value="support@scaffold.org"
                />

                <ContactInfo
                  icon="location_on"
                  label="Organization Area"
                  value="Bangladesh Blood Donor Support Network"
                />
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="sc-card p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="sc-label">Your Name</label>
                  <input
                    type="text"
                    required
                    className="sc-input mt-2"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="sc-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="sc-input mt-2"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="sc-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="sc-input mt-2"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="sc-label">Message</label>
                  <textarea
                    rows="5"
                    required
                    className="sc-textarea mt-2"
                    placeholder="Write your message"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" icon="send">
                  Send Message
                </Button>
              </div>
            </form>
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
                  Join as a donor
                </Button>
              </Link>

              <Link to="/search">
                <Button icon="search" size="lg" variant="secondary">
                  Search Donors
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

const FAQItem = ({ number, question, answer, isOpen, onToggle }) => {
  return (
    <div className="sc-card overflow-hidden p-5 sm:p-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex gap-4">
          <span className="mt-1 text-sm font-extrabold text-primary">
            {number}
          </span>

          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-ink">
              {question}
            </h3>

            {isOpen ? (
              <p className="mt-3 text-sm font-semibold leading-7 text-ink-muted">
                {answer}
              </p>
            ) : null}
          </div>
        </div>

        <span
          className={[
            "material-symbols-rounded shrink-0 rounded-full bg-primary-tint p-2 text-primary transition",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        >
          expand_more
        </span>
      </button>
    </div>
  );
};

const ContactInfo = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-surface-border bg-surface-soft p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-white text-primary shadow-sm">
        <span className="material-symbols-rounded">{icon}</span>
      </span>

      <div>
        <p className="text-xs font-bold text-ink-muted">{label}</p>
        <p className="text-sm font-extrabold text-ink">{value}</p>
      </div>
    </div>
  );
};

export default Home;