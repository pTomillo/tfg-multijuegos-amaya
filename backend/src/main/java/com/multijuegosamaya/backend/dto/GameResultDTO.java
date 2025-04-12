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
    private Long playerId;
    private String move;
    private String result;
}
