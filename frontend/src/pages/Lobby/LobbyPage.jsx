import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { AuthContext } from "../../context/AuthContext";

export default function LobbyPage() {
  const { gameId } = useParams();
  const { userId } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await apiClient.get(`/gameCatalog/${gameId}`);
        setGame(response.data);
      } catch (err) {
        console.error("Error al cargar datos del juego:", err);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await apiClient.get(`/match/availableRooms/${gameId}`);
        setRooms(response.data);
      } catch (err) {
        console.error("Error al cargar salas:", err);
      }
    };

    fetchGame();
    fetchRooms();
  }, [gameId]);

  const handleCreateRoom = async () => {
    try {
      const response = await apiClient.post(`/match/create`, {
        player1Id: userId,
        gameId: parseInt(gameId),
        matchType: "PVP",
      });
      const createdRoomId = response.data.id;
      navigate(`/match/${createdRoomId}`);
    } catch (err) {
      console.error("Error al crear sala:", err);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const response = await apiClient.post(`/match/${roomId}/join`, userId, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const match = response.data;
      localStorage.setItem("matchId", match.id);
      navigate(`/match/${match.id}`);
    } catch (error) {
      console.error("Error al unirse a la sala:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-textPrimary)] px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Lobby - {game?.title || "Cargando..."}
        </h1>

        <div className="text-center">
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:brightness-110"
          >
            Crear nueva sala
          </button>
        </div>

        <div className="space-y-4 mt-6">
          {rooms.length === 0 ? (
            <p className="text-center text-[var(--color-textSecondary)]">
              No hay salas disponibles aún.
            </p>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="p-4 bg-[var(--color-card)] rounded-lg shadow flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">
                    Sala #{room.id} - Jugador: {room.player1Username}
                  </p>
                  <p className="text-sm text-[var(--color-textSecondary)]">
                    Tipo: {room.matchType}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinRoom(room.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:brightness-110"
                >
                  Unirse
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
