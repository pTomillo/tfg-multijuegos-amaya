package com.multijuegosamaya.backend.dto;

import com.multijuegosamaya.backend.model.enums.GameStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameStatusDTO {
    private GameStatus status;
    private String message;
    private PlayerInfoDTO player1;
    private PlayerInfoDTO player2;
}
