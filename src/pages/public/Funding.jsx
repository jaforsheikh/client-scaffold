import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axiosPublic from "../../api/axiosPublic";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/dateFormatter";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const Funding = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <section className="bg-surface-page py-10 sm:py-14">
        <div className="sc-container">
          <div className="sc-card p-8 text-center">
            <h1 className="text-3xl font-extrabold text-ink">
              Stripe key missing
            </h1>
            <p className="mt-3 font-semibold text-ink-muted">
              Add VITE_STRIPE_PUBLISHABLE_KEY in client env.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <FundingContent />
    </Elements>
  );
};

const FundingContent = () => {
  const { user, dbUser } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [fundings, setFundings] = useState([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  const displayName = dbUser?.name || user?.name || user?.displayName || "User";
  const displayEmail = dbUser?.email || user?.email || "";

  const loadFundings = async () => {
    setLoading(true);

    try {
      const { data } = await axiosPublic.get("/api/fundings");
      setFundings(data?.fundings || []);
      setTotalFunding(data?.totalFunding || 0);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load funding data."
      );
      setFundings([]);
      setTotalFunding(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundings();
  }, []);

  const handleFundingPayment = async (event) => {
    event.preventDefault();

    const fundingAmount = Number(amount);

    if (!fundingAmount || fundingAmount < 1) {
      toast.error("Minimum funding amount is $1.");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not ready yet.");
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      toast.error("Card information is missing.");
      return;
    }

    setIsPaying(true);

    try {
      const { data } = await axiosPublic.post(
        "/api/fundings/create-payment-intent",
        { amount: fundingAmount }
      );

      const clientSecret = data?.clientSecret;

      if (!clientSecret) {
        throw new Error("Payment client secret missing.");
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: displayName,
            email: displayEmail,
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      if (paymentResult.paymentIntent?.status === "succeeded") {
        await axiosPublic.post("/api/fundings", {
          amount: fundingAmount,
          transactionId: paymentResult.paymentIntent.id,
        });

        toast.success("Funding payment successful.");
        setAmount("");
        card.clear();
        await loadFundings();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Funding payment failed."
      );
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <section className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container space-y-8">
        <div className="sc-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
                <span className="material-symbols-rounded text-4xl">
                  payments
                </span>
              </span>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  Funding
                </p>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  Support blood donation activities
                </h1>

                <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
                  Give secure funding through Stripe. Successful payments are
                  saved in MongoDB and shown in the funding table.
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-surface-border bg-white px-6 py-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-muted">
                Total Funding
              </p>

              <p className="mt-1 text-3xl font-extrabold text-primary">
                ${Number(totalFunding || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <form onSubmit={handleFundingPayment} className="sc-card p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Give Fund
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-ink-muted">
              Use Stripe test card: 4242 4242 4242 4242, any future date, any
              CVC.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="sc-label">Name</label>
                <input
                  type="text"
                  readOnly
                  value={displayName}
                  className="sc-input mt-2 bg-surface-soft"
                />
              </div>

              <div>
                <label className="sc-label">Email</label>
                <input
                  type="email"
                  readOnly
                  value={displayEmail}
                  className="sc-input mt-2 bg-surface-soft"
                />
              </div>

              <div>
                <label className="sc-label">Amount USD</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="sc-input mt-2"
                  placeholder="Example: 10"
                  required
                />
              </div>

              <div>
                <label className="sc-label">Card Information</label>
                <div className="mt-2 rounded-[20px] border border-surface-border bg-white px-4 py-4">
                  <CardElement
                    options={{
                      hidePostalCode: true,
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                icon="payments"
                disabled={!stripe || isPaying}
                className="w-full"
              >
                {isPaying ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </form>

          <section className="sc-card overflow-hidden">
            <div className="border-b border-surface-border p-5 sm:p-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink">
                Funding History
              </h2>

              <p className="mt-1 text-sm font-semibold text-ink-muted">
                All successful funding records from MongoDB.
              </p>
            </div>

            {loading ? (
              <div className="p-10">
                <Loader />
              </div>
            ) : fundings.length === 0 ? (
              <div className="p-10 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
                  <span className="material-symbols-rounded text-4xl">
                    savings
                  </span>
                </span>

                <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
                  No funding yet
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-ink-muted">
                  Successful funding records will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="border-surface-border text-xs uppercase tracking-[0.12em] text-ink-muted">
                      <th>Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Transaction</th>
                    </tr>
                  </thead>

                  <tbody>
                    {fundings.map((funding) => (
                      <tr
                        key={funding._id || funding.transactionId}
                        className="border-surface-border"
                      >
                        <td className="font-extrabold text-ink">
                          {funding.name}
                        </td>

                        <td className="text-sm font-semibold text-ink-muted">
                          {funding.email}
                        </td>

                        <td className="font-extrabold text-primary">
                          ${Number(funding.amount || 0).toFixed(2)}
                        </td>

                        <td className="font-semibold text-ink-muted">
                          {formatDate(funding.createdAt)}
                        </td>

                        <td>
                          <span className="rounded-full bg-surface-soft px-3 py-2 text-xs font-bold text-ink-muted">
                            {String(funding.transactionId).slice(0, 18)}...
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default Funding;