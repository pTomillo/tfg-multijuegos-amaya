package com.multijuegosamaya.backend.dto;

import com.multijuegosamaya.backend.model.Match;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchDTO {
    private Long id;
    private Long player1Id;
    private Long player2Id;
    private Long gameId;

    public static MatchDTO fromEntity(Match match) {
        return MatchDTO.builder()
                .id(match.getId())
                .player1Id(match.getPlayer1().getId())
                .player2Id(match.getPlayer2().getId())
                .gameId(match.getGame().getId())
                .build();
    }
}