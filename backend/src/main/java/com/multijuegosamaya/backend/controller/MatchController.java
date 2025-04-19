package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.*;
import com.multijuegosamaya.backend.mappers.MatchMapper;
import com.multijuegosamaya.backend.model.Game;
import com.multijuegosamaya.backend.model.Match;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.model.enums.GameStatus;
import com.multijuegosamaya.backend.model.enums.MatchStatus;
import com.multijuegosamaya.backend.repository.GameRepository;
import com.multijuegosamaya.backend.repository.MatchRepository;
import com.multijuegosamaya.backend.repository.UserRepository;
import com.multijuegosamaya.backend.service.JwtUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    // Create a new game room
    @PostMapping("/create")
    public ResponseEntity<MatchInfoDTO> createMatch(@RequestBody CreateMatchDTO createMatchDTO) {
        User player1 = userRepository.findById(createMatchDTO.getPlayer1Id()).orElseThrow(() -> new RuntimeException("Player not found"));
        Game game = gameRepository.findById(createMatchDTO.getGameId()).orElseThrow(() -> new RuntimeException("Game not found"));

        Match match = Match.builder()
                .player1(player1)
                .game(game)
                .status(MatchStatus.PENDING)
                .matchType(createMatchDTO.getMatchType())
                .build();

        Match createdMatch = matchRepository.save(match);
        System.out.println("Sala creada: " + createdMatch);
        return ResponseEntity.ok(MatchMapper.toDTO(createdMatch));
    }

    @PostMapping("/{matchId}/join")
    public ResponseEntity<MatchInfoDTO> joinMatch(@PathVariable("matchId") Long matchId) {

        // Find the player that is making the petition
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long player2Id = jwtUserDetailsService.getUserId(authentication.getName());
        User player2 = userRepository.findById(player2Id).orElseThrow(() -> new RuntimeException("Player not found"));

        // Find the match in the DB
        Match match = matchRepository.findById(matchId).orElseThrow(() -> new RuntimeException("Match not found"));

        // Check that the match is still pending and doesnt have a sencond player
        if (match.getStatus() != (MatchStatus.PENDING) || match.getPlayer2() != null) {
            return ResponseEntity.status(409).build();
        }

        // Add player 2 to the match and save it
        match.setPlayer2(player2);
        match.setStatus(MatchStatus.IN_PROGRESS);
        Match updatedMatch = matchRepository.save(match);

        // Prepare the info of the players to be sent
        PlayerInfoDTO player1Dto = new PlayerInfoDTO(
                match.getPlayer1().getId(),
                match.getPlayer1().getUsername(),
                match.getPlayer1().getProfilePicture()
        );

        PlayerInfoDTO player2Dto = new PlayerInfoDTO(
                match.getPlayer2().getId(),
                match.getPlayer2().getUsername(),
                match.getPlayer2().getProfilePicture()
        );

        // Send the message that starts the match
        GameStatusDTO startMsg = new GameStatusDTO(
                GameStatus.START,
                "Match has started!",
                player1Dto,
                player2Dto
        );
        messagingTemplate.convertAndSend("/topic/game/"+ matchId, startMsg);

        return ResponseEntity.ok(MatchMapper.toDTO(updatedMatch));
    }

    @GetMapping("/availableRooms/{gameId}")
    public ResponseEntity<List<MatchInfoDTO>> getAvailableRooms(@PathVariable("gameId") Long gameId) {
        List<Match> waitingMatches = matchRepository.findByGameIdAndStatus(gameId, MatchStatus.PENDING);
        System.out.println(waitingMatches);
        return ResponseEntity.ok(waitingMatches.stream().map(MatchMapper::toDTO).toList());
    }
}
