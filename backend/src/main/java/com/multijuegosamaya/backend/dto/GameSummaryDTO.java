package com.multijuegosamaya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameSummaryDTO {
    private Long matchId;
    private String message;
    private PlayerInfoDTO player1;
    private PlayerInfoDTO player2;
    private int player1Wins;
    private int player2Wins;
    private Long winnerId;
}