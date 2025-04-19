package com.multijuegosamaya.backend.dto;

import com.multijuegosamaya.backend.model.enums.MatchType;
import lombok.Data;

@Data
public class CreateMatchDTO {
    private Long player1Id;
    private Long gameId;
    private MatchType matchType;
}
