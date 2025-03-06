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
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Récupérer le rôle depuis Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userRole"); // Supprimer le rôle stocké
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-xl font-bold">Vinamor</Link>
      </div>
      <div className="space-x-4">
        <Link href="/dashboard">Tableau de bord</Link>
        <Link href="/reservations">Réservations</Link>
        <Link href="/providers">Prestataires</Link>
        <Link href="/commissions">Commissions</Link>
        <Link href="/payments">Paiements</Link>
        <Link href="/support">Support</Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-gray-700 px-2 py-1 rounded">{role}</span>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
              Déconnexion
            </button>
          </div>
        ) : (
          <button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-500 px-4 py-2 rounded">
            Connexion
          </button>
        )}
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </nav>
  );
}
