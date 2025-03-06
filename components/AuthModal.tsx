"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("client"); // Valeur par défaut
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Récupérer le rôle depuis Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role) {
            localStorage.setItem("userRole", userData.role);
          }
        }
      } else {
        // Inscription utilisateur
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ajouter l'utilisateur à Firestore avec son rôle
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: role,
          createdAt: new Date(),
        });

        localStorage.setItem("userRole", role);
      }

      onClose(); // Fermer la modal après connexion
      router.push("/dashboard"); // Rediriger vers le tableau de bord
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <button onClick={onClose} className="float-right text-gray-500">✖</button>
        <h2 className="text-xl font-semibold mb-4">{isLogin ? "Connexion" : "Inscription"}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Email (Visible) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded bg-white text-black"
              required
            />
          </div>


          {/* Mot de passe (Masqué par défaut) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded pr-10"
                required
              />
              {/* Bouton pour afficher/masquer le mot de passe */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Sélection du rôle */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sélectionnez votre rôle :</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border p-2 rounded bg-white text-black"
              >
                <option value="client">Client</option>
                <option value="vigneron">Vigneron</option>
                <option value="chauffeur">Chauffeur</option>
                <option value="acheteur">Acheteur</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 mt-2">
          {isLogin ? "Créer un compte" : "J'ai déjà un compte"}
        </button>
      </div>
    </div>
  );
}
