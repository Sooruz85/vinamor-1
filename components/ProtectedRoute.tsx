"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(role!))) {
      router.push("/"); // Redirige vers l'accueil si non autorisé
    }
  }, [user, role, loading, allowedRoles, router]);

  if (loading) {
    return <p className="text-center mt-10 text-lg text-gray-600">Chargement...</p>; // Affiche un message pendant le chargement
  }

  if (!user || !allowedRoles.includes(role!)) {
    return null; // Empêche l'affichage si l'accès est refusé
  }

  return <>{children}</>;
}
