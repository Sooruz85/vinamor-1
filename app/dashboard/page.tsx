"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Reservation {
  id: string;
  client: string;
  date: { seconds: number; nanoseconds: number };
  status: string;
}

export default function Dashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dateDesc"); // Par défaut : du plus récent au plus ancien

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationsSnap = await getDocs(collection(db, "reservations"));
        const data = reservationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
        setReservations(data);
        setFilteredReservations(data);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations", error);
      }
    };

    fetchData();
  }, []);

  // 📌 Fonction pour appliquer les filtres
  useEffect(() => {
    let updatedReservations = [...reservations];

    // Filtre par statut
    if (statusFilter !== "all") {
      updatedReservations = updatedReservations.filter(res => res.status === statusFilter);
    }

    // Recherche par client
    if (search.trim() !== "") {
      updatedReservations = updatedReservations.filter(res =>
        res.client.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Trier par date
    updatedReservations.sort((a, b) => {
      const dateA = new Date(a.date.seconds * 1000);
      const dateB = new Date(b.date.seconds * 1000);
      return sortBy === "dateDesc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    setFilteredReservations(updatedReservations);
  }, [search, statusFilter, sortBy, reservations]);

  return (
    <ProtectedRoute allowedRoles={["admin", "vigneron"]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de Bord</h1>

        {/* 📌 Filtres */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">Tous les statuts</option>
            <option value="Confirmée">Confirmée</option>
            <option value="Annulée">Annulée</option>
            <option value="En attente">En attente</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="dateDesc">Date (du plus récent au plus ancien)</option>
            <option value="dateAsc">Date (du plus ancien au plus récent)</option>
          </select>
        </div>

        {/* 📌 Liste des réservations filtrées */}
        <ReservationList reservations={filteredReservations} />
      </div>
    </ProtectedRoute>
  );
}

// 📌 Fonction pour convertir Firestore Timestamp en date lisible
const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
  if (!timestamp || !timestamp.seconds) return "Date inconnue";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// 📌 Composant Liste des Réservations
function ReservationList({ reservations }: { reservations: Reservation[] }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {reservations.length === 0 ? (
        <p className="text-gray-500">Aucune réservation trouvée.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {reservations.map((res) => (
            <li key={res.id} className="py-2 flex justify-between">
              <span>{res.client} - {formatDate(res.date)}</span>
              <span className={`text-sm font-semibold ${res.status === "Confirmée" ? "text-green-600" : "text-red-600"}`}>
                {res.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
