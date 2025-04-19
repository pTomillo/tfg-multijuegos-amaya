package com.multijuegosamaya.backend.service.game.engine;

import com.multijuegosamaya.backend.dto.*;
import com.multijuegosamaya.backend.model.Match;
import com.multijuegosamaya.backend.model.Round;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.model.enums.GameStatus;
import com.multijuegosamaya.backend.model.enums.MatchStatus;
import com.multijuegosamaya.backend.repository.MatchRepository;
import com.multijuegosamaya.backend.repository.RoundRepository;
import com.multijuegosamaya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service("PPT")
public class PPTGameEngine implements GameEngine {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RoundRepository roundRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchRepository matchRepository;

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

        // Wait for player two move.
        if (moves.size() < 2) {
            messagingTemplate.convertAndSend("/topic/game/" + matchId, new GameStatusDTO(GameStatus.WAITING, "Esperando al rival...", null, null));
            return;
        }

        // Process Result of the round
        Long[] players = moves.keySet().toArray(new Long[0]);
        String move1 = moves.get(players[0]);
        String move2 = moves.get(players[1]);

        String result1 = resolve(move1, move2);
        String result2 = resolve(move2, move1);

        // Determine the winner of the round
        Long winnerId = null;
        if (result1.equals("WIN")) {
            winnerId = players[0];
        } else if (result2.equals("WIN")) {
            winnerId = players[1];
        }

        // Save the round
        Match match = matchRepository.findByIdWithRounds(matchId).orElseThrow(() -> new RuntimeException("Match not found"));
        User winner = (winnerId != null) ? userRepository.findById(winnerId).orElse(null) : null;

        Round round = Round.builder().match(match).roundNumber(match.getRounds().size() + 1).movePlayer1(move1).movePlayer2(move2).winner(winner).build();

        roundRepository.save(round);

        // Save the updated match
        match.addRound(round);
        matchRepository.save(match);

        // Send the result to both players
        messagingTemplate.convertAndSend("/topic/game/" + matchId, new GameResultDTO(players[0], move1, result1));
        messagingTemplate.convertAndSend("/topic/game/" + matchId, new GameResultDTO(players[1], move2, result2));

        // Clean the moves of this round
        matchmoves.remove(matchId);

        // Chech if the match should be finished
        List<Round> rounds = match.getRounds();
        if (rounds.size() >= 3) {
            long winsP1 = rounds.stream()
                    .filter(r -> r.getWinner() != null && r.getWinner().getId().equals(match.getPlayer1().getId()))
                    .count();
            long winsP2 = rounds.stream()
                    .filter(r -> r.getWinner() != null && r.getWinner().getId().equals(match.getPlayer2().getId()))
                    .count();

            if (winsP1 > winsP2) {
                match.setWinner(match.getPlayer1());
            } else if (winsP2 > winsP1) {
                match.setWinner(match.getPlayer2());
            }

            match.setStatus(MatchStatus.FINISHED);
            matchRepository.save(match);

            PlayerInfoDTO player1DTO = new PlayerInfoDTO(
                    match.getPlayer1().getId(),
                    match.getPlayer1().getUsername(),
                    match.getPlayer1().getProfilePicture()
            );

            PlayerInfoDTO player2DTO = new PlayerInfoDTO(
                    match.getPlayer2().getId(),
                    match.getPlayer2().getUsername(),
                    match.getPlayer2().getProfilePicture()
            );

            String summaryMessage;
            Long winnerFinalId = (match.getWinner() != null) ? match.getWinner().getId() : null;

            if (winnerFinalId == null) {
                summaryMessage = "Empate entre " + player1DTO.getUsername() + " y " + player2DTO.getUsername();
            } else if (winnerFinalId.equals(player1DTO.getId())) {
                summaryMessage = "¡" + player1DTO.getUsername() + " ha ganado la partida!";
            } else {
                summaryMessage = "¡" + player2DTO.getUsername() + " ha ganado la partida!";
            }

            GameSummaryDTO summary = new GameSummaryDTO(
                    match.getId(),
                    summaryMessage,
                    player1DTO,
                    player2DTO,
                    (int) winsP1,
                    (int) winsP2,
                    winnerFinalId
            );

            messagingTemplate.convertAndSend("/topic/game/" + matchId, summary);
        }
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
