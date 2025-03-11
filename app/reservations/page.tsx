"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ReservationPage() {
  const [type, setType] = useState("privé");
  const [participants, setParticipants] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification du nombre de participants et blocage 48h avant
    const reservationDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = reservationDate.getTime() - currentDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference < 2) {
      alert("Les réservations doivent être effectuées au moins 48h à l'avance.");
      return;
    }

    if (type === "privé" && participants > 6) {
      alert("Maximum 6 personnes en visite privée.");
      return;
    }

    // Ajouter la réservation à Firestore
    try {
      await addDoc(collection(db, "reservations"), {
        client: name,
        email,
        phone,
        date,
        type,
        participants,
        pickup_location: type === "privé" ? pickupLocation : "Lieu fixe",
        status: "pending_payment",
        guide: "Sophie Dupont",
        chauffeur: "Marc Lambert",
        vigneron: "Domaine Château Rouge",
        price: type === "privé" ? 120 : 20 * participants,
        payment_status: "unpaid",
      });

      alert("Réservation effectuée. Veuillez procéder au paiement.");
      router.push("/panier/checkout");
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Réserver une visite</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Type de visite</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded">
            <option value="privé">Privé</option>
            <option value="groupé">Groupé</option>
          </select>
        </div>

        <div>
          <label>Nombre de participants</label>
          <input type="number" value={participants} onChange={(e) => setParticipants(parseInt(e.target.value))}
            className="w-full border p-2 rounded" min={1} max={type === "privé" ? 6 : 6} required />
        </div>

        {type === "privé" && (
          <div>
            <label>Lieu de prise en charge</label>
            <input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full border p-2 rounded" required />
          </div>
        )}

        <div>
          <label>Date de réservation</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label>Nom</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label>Téléphone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded" required />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Réserver</button>
      </form>
    </div>
  );
}
