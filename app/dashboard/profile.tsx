"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setEmail(userData.email || user.email);
          setRole(userData.role || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    try {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, { name, email });

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setMessage("Mise à jour réussie !");
    } catch (error: any) {
      setMessage(`Erreur : ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      {message && <p className="text-green-600">{message}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Laissez vide pour ne pas changer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Rôle</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-200"
            value={role}
            disabled
          />
        </div>

        <button onClick={handleUpdate} className="w-full bg-blue-500 text-white py-2 rounded">
          Mettre à jour
        </button>
      </div>
    </div>
  );
}
