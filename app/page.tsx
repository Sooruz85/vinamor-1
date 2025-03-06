"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Bienvenue sur Gestion Business Vin</h1>
      <p className="mt-2">Gérez vos réservations et services facilement.</p>
      <nav className="mt-6 space-x-4">
        <Link href="/dashboard" className="text-blue-600">Tableau de bord</Link>
        <Link href="/reservations" className="text-blue-600">Réservations</Link>
        <Link href="/providers" className="text-blue-600">Prestataires</Link>
        <Link href="/commissions" className="text-blue-600">Commissions</Link>
        <Link href="/payments" className="text-blue-600">Paiements</Link>
        <Link href="/support" className="text-blue-600">Support</Link>
      </nav>
    </div>
  );
}
