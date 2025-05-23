package com.multijuegosamaya.backend.model;

import com.multijuegosamaya.backend.model.enums.MatchStatus;
import com.multijuegosamaya.backend.model.enums.MatchType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player1_id", nullable = false)
    private User player1;

    @ManyToOne
    @JoinColumn(name = "player2_id") // Can be null if the game has a solo mode
    private User player2;

    @ManyToOne
    @JoinColumn(name = "winner_id") // Can be null in case there is a draw or no opponent
    private User winner;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    private Integer points;

    private Duration duration;

    private LocalDateTime date = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private MatchType matchType = MatchType.PVP;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<Round> rounds = new ArrayList<>();

    private String gameKey;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    public void addRound(Round round) {
        this.rounds.add(round);
        round.setMatch(this);
    }

    public void removeRound(Round round) {
        this.rounds.remove(round);
        round.setMatch(null);
    }

    public boolean isFinished() {
        return this.status == MatchStatus.FINISHED;
    }

    public boolean hasWinner() {
        return winner != null;
    }
}
