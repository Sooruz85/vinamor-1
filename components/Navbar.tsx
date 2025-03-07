"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      auth.onAuthStateChanged(async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role);
            localStorage.setItem("userRole", userData.role);
          }
        } else {
          setRole(null);
        }
      });
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userRole");
    router.push("/");
  };

  return (
    <nav className="bg-[#DDE1B8] shadow-lg text-[#1D0E1C] p-4 flex justify-between items-center">
      {/* Logo */}
      <div>
        <Link href="/" className="text-2xl font-bold hover:text-[#C0002D] transition duration-300">Vinamor</Link>
      </div>

      {/* Liens de navigation */}
      <div className="space-x-6 hidden md:flex">
        <Link href="/dashboard" className="hover:text-[#C0002D] transition duration-300">Tableau de bord</Link>
        <Link href="/reservations" className="hover:text-[#C0002D] transition duration-300">Réservations</Link>
        <Link href="/providers" className="hover:text-[#C0002D] transition duration-300">Prestataires</Link>
        <Link href="/commissions" className="hover:text-[#C0002D] transition duration-300">Commissions</Link>
        <Link href="/payments" className="hover:text-[#C0002D] transition duration-300">Paiements</Link>
        <Link href="/support" className="hover:text-[#C0002D] transition duration-300">Support</Link>
        <Link href="/payments/checkout" className="hover:text-[#C0002D] transition duration-300">Payer</Link>




        {/* 🔥 Lien Admin visible uniquement pour les admins */}
        {user && role === "admin" && (
          <Link href="/users" className="text-blue-600 hover:underline">Gestion Utilisateurs</Link>
        )}
      </div>

      {/* Connexion / Déconnexion */}
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-gray-700 text-white px-2 py-1 rounded">{role || "Chargement..."}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
              Déconnexion
            </button>
          </div>
        ) : (
          <button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Connexion
          </button>
        )}
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </nav>
  );
}
