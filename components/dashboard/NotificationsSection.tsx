"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const querySnapshot = await getDocs(collection(db, "notifications"));
      const notificationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsList);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li key={notif.id} className="bg-gray-100 p-3 rounded shadow">
              {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
