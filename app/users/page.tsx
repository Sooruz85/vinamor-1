"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2, UserCheck, UserX } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <UserList users={users} setUsers={setUsers} />
        )}
      </div>
    </ProtectedRoute>
  );
}

// 📌 Composant Liste des Utilisateurs
function UserList({ users, setUsers }: { users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>> }) {
  const updateUserRole = async (id: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
      setUsers(prev => prev.map(user => (user.id === id ? { ...user, role: newRole } : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {users.length === 0 ? (
        <p className="text-gray-500">Aucun utilisateur trouvé.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.id} className="py-3 flex justify-between items-center">
              <span className="text-lg">{user.email}</span>
              <div className="flex items-center space-x-3">
                {/* Sélecteur de rôle */}
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="border p-2 rounded bg-white text-black"
                >
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="vigneron">Vigneron</option>
                  <option value="chauffeur">Chauffeur</option>
                  <option value="acheteur">Acheteur</option>
                </select>

                {/* Supprimer l'utilisateur */}
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
