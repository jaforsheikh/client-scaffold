import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StripeFundingForm from "../../components/payment/StripeFundingForm";
import { fundingRecords } from "../../data/fundingMockData";
import { formatDate } from "../../utils/dateFormatter";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const presetAmounts = [10, 25, 50, 100];

const Funding = () => {
  const [amount, setAmount] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedAmount = useMemo(() => {
    const numericAmount = Number(amount);
    return Number.isNaN(numericAmount) ? 0 : numericAmount;
  }, [amount]);

  const totalFunding = fundingRecords.reduce(
    (total, record) => total + record.amount,
    0
  );

  return (
    <section className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container space-y-6">
        <PageHeader
          eyebrow="Private Funding"
          title="Funding records"
          description="Review all funding contributions made by users and use the Give Fund button to support the organization."
          icon="payments"
          action={
            <Button icon="volunteer_activism" onClick={() => setIsModalOpen(true)}>
              Give Fund
            </Button>
          }
        />

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon="payments"
            label="Total Funding"
            value={`$${totalFunding}`}
            note="Total contributed amount"
            tone="success"
          />

          <StatCard
            icon="receipt_long"
            label="Total Records"
            value={fundingRecords.length}
            note="Funding records available"
            tone="primary"
          />

          <StatCard
            icon="favorite"
            label="Mission Support"
            value="Active"
            note="Community funded organization"
            tone="teal"
          />
        </section>

        <section className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-ink">
                  All Funding History
                </h2>

                <p className="mt-1 text-sm font-semibold text-ink-muted">
                  Each funding record includes user name, amount and funding date.
                </p>
              </div>

              <Button
                variant="secondary"
                icon="add_card"
                onClick={() => setIsModalOpen(true)}
              >
                Give Fund
              </Button>
            </div>
          </div>

          {fundingRecords.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon="payments"
                title="No funding record found"
                description="No user has contributed funding yet."
                action={
                  <Button icon="volunteer_activism" onClick={() => setIsModalOpen(true)}>
                    Give First Fund
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                    <th>Fund ID</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Amount</th>
                    <th>Funding Date</th>
                  </tr>
                </thead>

                <tbody>
                  {fundingRecords.map((record) => (
                    <tr key={record.id} className="border-surface-border">
                      <td>
                        <p className="font-extrabold text-ink">{record.id}</p>
                      </td>

                      <td>
                        <p className="font-extrabold text-ink">{record.name}</p>
                      </td>

                      <td>
                        <p className="text-sm font-semibold text-ink-muted">
                          {record.email}
                        </p>
                      </td>

                      <td>
                        <p className="text-lg font-extrabold text-primary">
                          ${record.amount}
                        </p>
                      </td>

                      <td>
                        <p className="font-bold text-ink">
                          {formatDate(record.fundingDate)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[30px] bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  Give Fund
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                  Support the organization
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
                  Choose an amount and complete funding through Stripe Elements.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-ink-muted transition hover:bg-primary-tint hover:text-primary"
                aria-label="Close funding modal"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={selectedAmount === preset ? "primary" : "secondary"}
                  onClick={() => setAmount(preset)}
                >
                  ${preset}
                </Button>
              ))}
            </div>

            <div className="mt-5">
              <label className="sc-label">Custom Amount</label>
              <input
                type="number"
                min="1"
                className="sc-input mt-2"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="mt-6 rounded-[24px] border border-surface-border bg-surface-soft p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-extrabold text-ink-muted">
                  Funding Amount
                </p>

                <p className="text-3xl font-extrabold tracking-tight text-primary">
                  ${selectedAmount || 0}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <StripeFundingForm amount={selectedAmount} />
                </Elements>
              ) : (
                <div className="rounded-[24px] border border-state-warning/20 bg-state-warningTint p-5">
                  <div className="flex gap-3">
                    <span className="material-symbols-rounded text-state-warning">
                      info
                    </span>

                    <div>
                      <h3 className="font-extrabold text-ink">
                        Stripe key needed
                      </h3>

                      <p className="mt-1 text-sm font-semibold leading-6 text-ink-muted">
                        Add VITE_STRIPE_PUBLISHABLE_KEY in your .env.local file
                        to activate Stripe Elements payment form.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Funding;