package com.multijuegosamaya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExtendedMatchInfoDTO {
    private Long matchId;
    private PlayerInfoDTO player1;
    private PlayerInfoDTO player2;
}
