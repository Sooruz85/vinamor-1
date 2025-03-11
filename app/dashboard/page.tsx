"use client";
import { useState } from "react";
import ProfileSection from "@/components/dashboard/ProfileSection";
import NotificationsSection from "@/components/dashboard/NotificationsSection";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-[#1D0E1C] text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Tableau de Bord</h2>
        <nav className="space-y-4">
          <button
            className={`w-full text-left p-2 rounded ${activeTab === "profile" ? "bg-[#C0002D]" : "hover:bg-gray-700"}`}
            onClick={() => setActiveTab("profile")}
          >
            Profil
          </button>
          <button
            className={`w-full text-left p-2 rounded ${activeTab === "notifications" ? "bg-[#C0002D]" : "hover:bg-gray-700"}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
        </nav>
      </aside>

      {/* Contenu dynamique */}
      <main className="flex-1 p-8">
        {activeTab === "profile" ? <ProfileSection /> : <NotificationsSection />}
      </main>
    </div>
  );
}
