package com.multijuegosamaya.backend.service.game.engine;

import com.multijuegosamaya.backend.dto.GameResultDTO;
import com.multijuegosamaya.backend.dto.GameStatusDTO;
import com.multijuegosamaya.backend.dto.MoveDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service("PPT")
public class PPTGameEngine implements GameEngine {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private Map<Long, Map<Long, String>> matchmoves = new ConcurrentHashMap<>();

    @Override
    public void processMove(MoveDTO move) {
        // Get the parameters of the movement
        Long matchId = move.getMatchId();
        Long player = move.getPlayerId();
        String playerMove = move.getPlayerMove();

        // Register the move
        matchmoves.putIfAbsent(matchId, new ConcurrentHashMap<>());
        Map<Long, String> moves = matchmoves.get(matchId);
        moves.put(player, playerMove);

        if (moves.size() < 2) {
            // Wait for player two move.
            messagingTemplate.convertAndSend("/topic/game/" + matchId,
                    new GameStatusDTO( "WAITING", player + " ha jugado. Esperando al rival..."));
            return;
        }

        // Process Result
        Long[] players = moves.keySet().toArray(new Long[0]);
        String move1 = moves.get(players[0]);
        String move2 = moves.get(players[1]);

        String result1 = resolve(move1, move2);
        String result2 = resolve(move2, move1);

        // Send the result to both players
        messagingTemplate.convertAndSend("/topic/game/" + matchId, new GameResultDTO(players[0], move1, result1));
        messagingTemplate.convertAndSend("/topic/game/" + matchId, new GameResultDTO(players[1], move2, result2));

        // Clean the moves of this round
        matchmoves.remove(matchId);
    }

    private String resolve(String move1, String move2) {
        if (move1.equals(move2)) return "DRAW";
        return switch (move1) {
            case "ROCK" -> move2.equals("SCISSORS") ? "WIN" : "LOSE";
            case "PAPER" -> move2.equals("ROCK") ? "WIN" : "LOSE";
            case "SCISSORS" -> move2.equals("PAPER") ? "WIN" : "LOSE";
            default -> "INVALID";
        };
    }
}
