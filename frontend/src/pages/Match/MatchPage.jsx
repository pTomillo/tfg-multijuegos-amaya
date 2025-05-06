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
        console.log("Mensaje WS recibido:", data);

        const numericUserId = parseInt(userId);

        if (
          data.status === "START" &&
          data.player1?.id != null &&
          data.player2?.id != null
        ) {
          const isPlayer1 = data.player1.id === numericUserId;

          console.log("User ID:", numericUserId);
          console.log("Player1 ID:", data.player1.id);
          console.log("Player2 ID:", data.player2.id);
          console.log(
            "Asignando playerInfo:",
            isPlayer1 ? "player1" : "player2"
          );

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
          setIsWaiting(false);
          setGameStarted(true);
        }

        if (data.result || data.message || data.winnerId != null) {
          setGameData(data);
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

      {gameStarted && playerInfo?.id && opponentInfo?.id && (
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
