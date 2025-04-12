package com.multijuegosamaya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoundDTO {
    private Long id;
    private Integer roundNumber;
    private String movePlayer1;
    private String movePlayer2;
    private Long matchId;
    private Long winnerId;
}
