import { useState } from "react";
import FriendList from "../../components/Friends/FriendList";
import FriendRequests from "../../components/Friends/FriendRequests";
import UserSearch from "../../components/Friends/UserSearch";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-textPrimary)] px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Buscador */}
        <div className="p-4">
          <UserSearch />
        </div>

        {/* Botones para cambiar entre secciones */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded ${
              activeTab === "list"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
          >
            Lista de Amigos
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded ${
              activeTab === "requests"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
          >
            Solicitudes de Amistad
          </button>
        </div>

        {/* Contenido dinámico */}
        {activeTab === "list" ? <FriendList /> : <FriendRequests />}
      </div>
    </div>
  );
}
