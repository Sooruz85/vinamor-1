"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileSection() {
  const [user, setUser] = useState(auth.currentUser);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", role: "" });
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  const handlePasswordChange = async () => {
    if (!newPassword) return;
    try {
      await user.updatePassword(newPassword);
      setMessage("Mot de passe mis à jour !");
    } catch (error) {
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profil</h2>
      <div className="space-y-2">
        <p><strong>Nom :</strong> {profile.name}</p>
        <p><strong>Email :</strong> {profile.email}</p>
        <p><strong>Téléphone :</strong> {profile.phone}</p>
        <p><strong>Rôle :</strong> {profile.role}</p>
      </div>

      {/* Changer de mot de passe */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Modifier le mot de passe</h3>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <button
          onClick={handlePasswordChange}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Changer
        </button>
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </div>
    </div>
  );
}
