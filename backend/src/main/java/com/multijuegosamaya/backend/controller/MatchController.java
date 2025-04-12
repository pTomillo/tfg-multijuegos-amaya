package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.MatchDTO;
import com.multijuegosamaya.backend.model.Game;
import com.multijuegosamaya.backend.model.Match;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.repository.GameRepository;
import com.multijuegosamaya.backend.repository.MatchRepository;
import com.multijuegosamaya.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    @PostMapping
    public MatchDTO createMatch(@RequestBody MatchDTO dto) {
        User player1 = userRepository.findById(dto.getPlayer1Id()).orElseThrow();
        User player2 = userRepository.findById(dto.getPlayer2Id()).orElseThrow();
        Game game = gameRepository.findById(dto.getGameId()).orElseThrow();

        Match match = Match.builder()
                .player1(player1)
                .player2(player2)
                .game(game)
                .date(LocalDateTime.now())
                .duration(Duration.ZERO)
                .points(0)
                .build();

        Match saved = matchRepository.save(match);
        return MatchDTO.fromEntity(saved);
    }
}
