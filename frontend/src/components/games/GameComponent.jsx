import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const moves = ["ROCK", "PAPER", "SCISSORS"];
const moveImages = {
  ROCK: "/GameComponent/rock.svg",
  PAPER: "/GameComponent/paper.svg",
  SCISSORS: "/GameComponent/scissors.svg",
};
const moveTexts = {
  ROCK: "/GameComponent/rockText.svg",
  PAPER: "/GameComponent/textPaper.svg",
  SCISSORS: "/GameComponent/textScissors.svg",
};

export default function GameComponent({
  matchId,
  player,
  opponent,
  stompClient,
  gameData,
}) {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [score, setScore] = useState({ you: 0, opponent: 0 });
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(0);
  const [opponentMove, setOpponentMove] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);

  useEffect(() => {
    if (!stompClient?.current) return;

    const subscription = stompClient.current.subscribe(
      `/topic/game/${matchId}`,
      (msg) => {
        const body = JSON.parse(msg.body);
        console.log("WS recibido en GameComponent:", body);

        if (
          body.status === "WAITING" &&
          body.player1?.id != null &&
          body.player2?.id != null
        ) {
          setWaiting(true);
        }

        // Rondas
        if (body.movePlayer1 && body.movePlayer2) {
          const tuId = Number(userId);
          const {
            player1Id,
            player2Id,
            movePlayer1,
            movePlayer2,
            winnerId,
            message,
          } = body;

          const player1IdNum = Number(player1Id);
          const player2IdNum = Number(player2Id);
          const winnerIdNum = winnerId !== null ? Number(winnerId) : null;

          let tuMovimiento, rivalMovimiento;

          if (tuId === player1IdNum) {
            tuMovimiento = movePlayer1;
            rivalMovimiento = movePlayer2;
          } else if (tuId === player2IdNum) {
            tuMovimiento = movePlayer2;
            rivalMovimiento = movePlayer1;
          } else {
            console.warn("userId no coincide con ninguno de los jugadores:", {
              tuId,
              player1IdNum,
              player2IdNum,
            });
            return;
          }

          console.log("Jugadas interpretadas:", {
            tuMovimiento,
            rivalMovimiento,
            tuId,
            winnerIdNum,
          });

          setOpponentMove(rivalMovimiento);

          if (winnerIdNum === null) {
            setSummary("Empate");
          } else if (tuId === winnerIdNum) {
            setScore((prev) => ({ ...prev, you: prev.you + 1 }));
            setSummary("Ganaste esta ronda.");
          } else {
            setScore((prev) => ({ ...prev, opponent: prev.opponent + 1 }));
            setSummary("Perdiste esta ronda.");
          }

          setWaiting(false);
        }

        if (
          body.matchId != null &&
          body.player1 &&
          body.player2 &&
          typeof body.player1Wins === "number" &&
          typeof body.player2Wins === "number"
        ) {
          setGameOver(true);
          setWaiting(true);
          setSummary(body.message || "Partida finalizada.");
          setShowEndPopup(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [stompClient, matchId, userId]);

  const submitMove = () => {
    const move = moves[selectedMoveIndex];
    console.log("Enviando jugada:", move);
    stompClient.current.send(
      "/app/game/move",
      {},
      JSON.stringify({
        matchId,
        playerId: userId,
        gameKey: "PPT",
        playerMove: move,
      })
    );
    setWaiting(true);
    setOpponentMove(null);
    setSummary(null);
  };

  const cycleMove = (dir) => {
    if (!waiting && !gameOver) {
      setSelectedMoveIndex((prev) => (prev + dir + 3) % 3);
    }
  };

  const handleClosePopup = () => {
    setShowEndPopup(false);
    const gameId = gameData?.gameId || player?.gameId || 1;
    navigate(`/games/${gameId}/lobby`);
  };

  return (
    <div className="bg-[var(--color-card)] p-6 mt-10 max-w-[700px] mx-auto rounded-3xl shadow-md space-y-6 relative">
      <div className="text-center text-2xl font-bold">
        Piedra, Papel o Tijera
      </div>

      <div className="flex justify-between items-center text-center">
        <div className="flex flex-col items-center w-1/3">
          <img
            src={
              player?.profilePicture
                ? `${import.meta.env.VITE_MEDIA_URL}${player.profilePicture}`
                : "/default_avatar.png"
            }
            className="w-16 h-16 rounded-full object-cover"
            alt="Tu avatar"
          />
          <div className="font-semibold mt-1">{player?.username || "Tú"}</div>
          <div className="text-lg">
            Puntos: {player?.id === Number(userId) ? score.you : score.opponent}
          </div>
        </div>

        <div className="text-xl font-bold text-gray-500">VS</div>

        <div className="flex flex-col items-center w-1/3">
          <img
            src={
              opponent?.profilePicture
                ? `${import.meta.env.VITE_MEDIA_URL}${opponent.profilePicture}`
                : "/default_avatar.png"
            }
            className="w-16 h-16 rounded-full object-cover"
            alt="Avatar rival"
          />
          <div className="font-semibold mt-1">
            {opponent?.username || "Rival"}
          </div>
          <div className="text-lg">
            Puntos:{" "}
            {opponent?.id === Number(userId) ? score.you : score.opponent}
          </div>
        </div>
      </div>

      <hr />

      <div className="text-center">
        {opponentMove && (
          <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
            El rival eligió:
            <img
              src={moveImages[opponentMove]}
              alt="Movimiento rival"
              className="mx-auto h-12"
            />
          </div>
        )}

        <div className="flex justify-center items-center gap-4">
          <img
            src="/GameComponent/flechaIzquierda.svg"
            className={`w-6 h-6 ${
              waiting || gameOver
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => cycleMove(-1)}
            alt="Izquierda"
          />
          <div className="flex flex-col items-center">
            <img
              src={moveImages[moves[selectedMoveIndex]]}
              alt="Tu jugada"
              className="h-16"
            />
            <img
              src={moveTexts[moves[selectedMoveIndex]]}
              alt="Texto jugada"
              className="h-6 mt-2"
            />
          </div>
          <img
            src="/GameComponent/flechaDerecha.svg"
            className={`w-6 h-6 ${
              waiting || gameOver
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => cycleMove(1)}
            alt="Derecha"
          />
        </div>

        <button
          onClick={submitMove}
          disabled={waiting || gameOver}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:brightness-110 disabled:opacity-50"
        >
          Hacer jugada
        </button>

        {waiting && !gameOver && (
          <div className="text-sm text-gray-500 mt-2">
            Esperando al oponente...
          </div>
        )}
      </div>

      {summary && (
        <div className="mt-4 text-center text-lg font-semibold text-green-600">
          {summary}
        </div>
      )}

      {showEndPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-xl shadow-lg max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4">¡Partida terminada!</h2>
            <p className="text-lg mb-6">{summary}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:brightness-110"
              onClick={handleClosePopup}
            >
              Volver al lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
