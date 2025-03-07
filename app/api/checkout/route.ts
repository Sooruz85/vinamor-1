import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    console.log("Requête reçue pour créer un paiement");

    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      console.error("Montant invalide:", amount);
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    console.log("Création du paiement avec Stripe...");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convertir en centimes
      currency: "eur",
      payment_method_types: ["card"],
    });

    console.log("Paiement créé avec succès:", paymentIntent);
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erreur Stripe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
