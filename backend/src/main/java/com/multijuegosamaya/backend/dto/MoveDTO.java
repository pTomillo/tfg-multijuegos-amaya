package com.multijuegosamaya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MoveDTO {
    private Long matchId;
    private Long playerId;
    private String gameKey;
    private String playerMove;
}
