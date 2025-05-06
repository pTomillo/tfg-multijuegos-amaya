import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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
  const [score, setScore] = useState({ you: 0, opponent: 0 });
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(0);
  const [opponentMove, setOpponentMove] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!stompClient?.current) return;

    const subscription = stompClient.current.subscribe(
      `/topic/game/${matchId}`,
      (msg) => {
        const body = JSON.parse(msg.body);
        console.log("GameComponent recibió:", body);

        if (
          body.status === "WAITING" &&
          body.player1?.id != null &&
          body.player2?.id != null
        ) {
          setWaiting(true);
        }

        if (body.result) {
          const isMyMove = body.playerId === userId;
          if (!isMyMove) {
            setOpponentMove(body.move);
          }

          if (body.result === "WIN") {
            setScore((prev) => ({ ...prev, you: prev.you + 1 }));
          } else if (body.result === "LOSE") {
            setScore((prev) => ({ ...prev, opponent: prev.opponent + 1 }));
          }

          setWaiting(false);
          setSummary(body.message || null);
        }

        if (body.winnerId != null) {
          setWaiting(true);
          setGameOver(true);
          setSummary(body.message || "Partida finalizada.");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [stompClient, matchId, userId]);

  const submitMove = () => {
    const move = moves[selectedMoveIndex];
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
    setSelectedMoveIndex((prev) => (prev + dir + 3) % 3);
  };

  return (
    <div className="bg-[var(--color-card)] p-4 rounded-lg shadow-md space-y-4">
      <div className="text-center text-xl font-bold">
        Piedra, Papel o Tijera
      </div>

      <div className="flex justify-between items-center text-lg font-medium">
        <span>Tú: {score.you}</span>
        <span>Rival: {score.opponent}</span>
      </div>

      <div className="text-center space-y-2">
        <img
          src={
            opponent?.profilePicture
              ? `${import.meta.env.VITE_MEDIA_URL}${opponent.profilePicture}`
              : "/default_avatar.png"
          }
          className="mx-auto w-16 h-16 rounded-full object-cover"
          alt="Avatar del oponente"
        />
        <div className="text-lg">{opponent?.username || "Rival"}</div>
        {opponentMove && (
          <img
            src={moveImages[opponentMove]}
            alt="Movimiento del oponente"
            className="mx-auto h-16"
          />
        )}
      </div>

      <hr />

      <div className="text-center">
        <div className="flex justify-center items-center gap-4">
          <img
            src="/GameComponent/flechaIzquierda.svg"
            className="w-6 h-6 cursor-pointer"
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
            className="w-6 h-6 cursor-pointer"
            onClick={() => cycleMove(1)}
            alt="Derecha"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={submitMove}
          disabled={waiting || gameOver}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:brightness-110 disabled:opacity-50"
        >
          Hacer jugada
        </button>
      </div>

      {waiting && !gameOver && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Esperando jugada del oponente...
        </div>
      )}

      {summary && (
        <div className="mt-4 text-center text-lg font-semibold text-green-600">
          {summary}
        </div>
      )}
    </div>
  );
}
