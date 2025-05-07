import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { AuthContext } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";
import GameComponent from "../../components/games/GameComponent";

export default function MatchPage() {
  const { matchId } = useParams();
  const { userId } = useContext(AuthContext);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [opponentInfo, setOpponentInfo] = useState(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState(null);

  const stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL + "/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, async () => {
      stompClient.current.subscribe(`/topic/game/${matchId}`, (msg) => {
        const data = JSON.parse(msg.body);

        // Mensaje de inicio de partida
        if (data.status === "START") {
          const isPlayer1 = data.player1.id === userId;

          const fixedPlayer1 = {
            ...data.player1,
            profilePicture:
              data.player1.avatarUrl || data.player1.profilePicture,
          };
          const fixedPlayer2 = {
            ...data.player2,
            profilePicture:
              data.player2.avatarUrl || data.player2.profilePicture,
          };

          setPlayerInfo(isPlayer1 ? fixedPlayer1 : fixedPlayer2);
          setOpponentInfo(isPlayer1 ? fixedPlayer2 : fixedPlayer1);
          setGameStarted(true);
          setIsWaiting(false);
        }

        // Mensajes de juego posteriores (resumen final)
        if (data.winnerId !== undefined && data.player1Wins !== undefined) {
          setGameData(data); // Se lo pasamos al GameComponent
        }
      });

      try {
        await apiClient.put(`/match/${matchId}/join`);
      } catch (err) {
        if (err.response?.status !== 409) {
          console.error("Error al unirse a la partida:", err);
        }
      }
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [matchId, userId]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-textPrimary)] px-4 py-6">
      {isWaiting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 shadow-lg text-center">
            Esperando a que se una un oponente...
          </div>
        </div>
      )}

      {gameStarted && playerInfo && opponentInfo && (
        <GameComponent
          matchId={parseInt(matchId)}
          player={playerInfo}
          opponent={opponentInfo}
          stompClient={stompClient}
          gameData={gameData}
        />
      )}
    </div>
  );
}
