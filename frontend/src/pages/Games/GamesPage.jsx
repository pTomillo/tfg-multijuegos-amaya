// src/pages/Games/GamesPage.jsx
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import GameCard from "../../components/games/GameCard";

export default function GamesPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await apiClient.get("/gameCatalog/list");
        setGames(response.data || []);
      } catch (error) {
        console.error("Error al cargar juegos:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-textPrimary)] px-4 py-10">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl font-bold">
          ¡Bienvenidos al Catálogo de Multijuegos Amaya!
        </h1>
        <p className="text-lg">
          Explora nuestra amplia gama de juegos y únete al lobby que más te
          llame la atención.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
