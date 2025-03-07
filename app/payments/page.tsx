"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });

    const data = await response.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    const { clientSecret } = data;
    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: { card: elements?.getElement(CardElement)! },
    });

    if (result?.error) {
      setError(result.error.message!);
    } else {
      setSuccess("Paiement réussi !");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Paiement sécurisé</h1>

      <form onSubmit={handlePayment} className="bg-white shadow-md rounded-lg p-6">
        <label className="block text-lg font-medium mb-2">Montant (€)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          required
        />

        <label className="block text-lg font-medium mb-2">Carte bancaire</label>
        <div className="border p-2 rounded mb-4">
          <CardElement />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Paiement en cours..." : "Payer"}
        </button>
      </form>
    </div>
  );
}
