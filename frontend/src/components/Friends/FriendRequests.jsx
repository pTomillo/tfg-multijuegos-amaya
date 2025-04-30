import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import authService from "../../services/authService";

export default function FriendRequests() {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [sent, received] = await Promise.all([
        apiClient.get("/friends/requestSent"),
        apiClient.get("/friends/recievedRequest"),
      ]);

      setSentRequests(sent.data);
      setReceivedRequests(received.data);

      // Obtener IDs únicos de usuarios a buscar
      const userIds = [
        ...new Set([
          ...sent.data.map((r) => r.user2Id),
          ...received.data.map((r) => r.user1Id),
        ]),
      ];

      const users = await Promise.all(
        userIds.map((id) => authService.getCurrentUser(id))
      );

      const map = {};
      users.forEach((u) => (map[u.id] = u));
      setUsersMap(map);
    } catch (err) {
      console.error("Error al obtener solicitudes de amistad:", err);
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      await apiClient.put(`/friends/accept/${friendshipId}`);
      fetchRequests();
    } catch (err) {
      console.error("Error al aceptar solicitud:", err);
    }
  };

  const handleReject = async (friendshipId) => {
    try {
      await apiClient.delete(`/friends/reject/${friendshipId}`);
      fetchRequests();
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-6">
      {/* Solicitudes enviadas */}
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-4 text-center md:text-left">
          Solicitudes Enviadas
        </h3>
        <div className="space-y-4">
          {sentRequests.map((req) => {
            const user = usersMap[req.user2Id];
            return (
              <div
                key={req.id}
                className="bg-[var(--color-card)] p-4 rounded shadow-md flex items-center gap-4"
              >
                <img
                  src={
                    user?.profilePicture
                      ? `${import.meta.env.VITE_MEDIA_URL}${
                          user.profilePicture
                        }`
                      : "/default_avatar.png"
                  }
                  alt={user?.username}
                  className="w-12 h-12 rounded-full border"
                />
                <span className="font-medium">{user?.username}</span>
                <span className="ml-auto text-sm text-gray-500">Pendiente</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solicitudes recibidas */}
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-4 text-center md:text-left">
          Solicitudes Recibidas
        </h3>
        <div className="space-y-4">
          {receivedRequests.map((req) => {
            const user = usersMap[req.user1Id];
            return (
              <div
                key={req.id}
                className="bg-[var(--color-card)] p-4 rounded shadow-md flex items-center gap-4"
              >
                <img
                  src={
                    user?.profilePicture
                      ? `${import.meta.env.VITE_MEDIA_URL}${
                          user.profilePicture
                        }`
                      : "/default_avatar.png"
                  }
                  alt={user?.username}
                  className="w-12 h-12 rounded-full border"
                />
                <span className="font-medium">{user?.username}</span>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:brightness-110"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:brightness-110"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
