import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../common/Button";

const StripeFundingForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not ready yet.");
      return;
    }

    if (!amount || Number(amount) < 1) {
      toast.error("Please enter a valid funding amount.");
      return;
    }

    setProcessing(true);

    try {
      const card = elements.getElement(CardElement);

      if (!card) {
        toast.error("Card information is missing.");
        return;
      }

      toast.success("Stripe card form is ready. Backend payment intent will be connected later.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-5">
      <div>
        <label className="sc-label">Card Information</label>

        <div className="mt-2 rounded-[18px] border border-surface-border bg-white px-4 py-4 shadow-sm transition focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#18181B",
                  fontWeight: "600",
                  "::placeholder": {
                    color: "#71717A",
                  },
                },
                invalid: {
                  color: "#DC2626",
                },
              },
            }}
          />
        </div>

        <p className="mt-2 text-xs font-semibold leading-5 text-ink-muted">
          Use Stripe test card after backend payment intent is connected.
        </p>
      </div>

      <Button
        type="submit"
        icon="credit_card"
        loading={processing}
        disabled={!stripe || processing}
        className="w-full"
      >
        Fund ${amount || 0}
      </Button>
    </form>
  );
};

export default StripeFundingForm;