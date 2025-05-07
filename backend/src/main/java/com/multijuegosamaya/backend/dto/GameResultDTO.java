package com.multijuegosamaya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameResultDTO {
    private Long player1Id;
    private Long player2Id;
    private String movePlayer1;
    private String movePlayer2;
    private Long winnerId;
    private String message;
}