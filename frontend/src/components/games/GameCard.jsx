// src/components/games/GameCard.jsx
import { useNavigate } from "react-router-dom";

export default function GameCard({ game }) {
  const navigate = useNavigate();

  const handleJoinLobby = () => {
    navigate(`/games/${game.id}/lobby`);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[var(--color-card)] rounded-2xl shadow-md overflow-hidden">
      {/* Imagen del juego */}
      <div className="flex-shrink-0 w-full md:w-1/2 h-48 md:h-auto">
        <img
          src={`/game_icon_${game.id}.png`}
          alt={`Icono del juego ${game.title}`}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Detalles del juego */}
      <div className="flex flex-col justify-center items-center text-center p-6 space-y-3 w-full md:w-1/2">
        <h2 className="text-xl font-bold">{game.title}</h2>
        <p className="text-[var(--color-textSecondary)]">{game.description}</p>
        <button
          onClick={handleJoinLobby}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:brightness-110 transition"
        >
          Unirse al Lobby
        </button>
      </div>
    </div>
  );
}
