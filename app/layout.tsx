import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext"; // 🔥 Gestion globale de l'authentification

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestion Business Vin",
  description: "Application de gestion pour entreprises viticoles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider> {/* 🔥 Fournisseur d'authentification */}
          <Navbar />  {/* 🔥 Navbar affichée sur toutes les pages */}
          <main className="container mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
''
