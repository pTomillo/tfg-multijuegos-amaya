package com.multijuegosamaya.backend.dto;

import com.multijuegosamaya.backend.model.enums.MatchStatus;
import com.multijuegosamaya.backend.model.enums.MatchType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchInfoDTO {
    private Long id;
    private String gameTitle;
    private Long gameId;
    private String player1Username;
    private Long player1Id;
    private MatchStatus status;
    private MatchType matchType;
}
