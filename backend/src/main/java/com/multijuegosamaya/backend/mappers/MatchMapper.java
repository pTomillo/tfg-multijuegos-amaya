package com.multijuegosamaya.backend.mappers;

import com.multijuegosamaya.backend.dto.MatchInfoDTO;
import com.multijuegosamaya.backend.model.Match;

public class MatchMapper {
    public static MatchInfoDTO toDTO(Match match) {
        return new MatchInfoDTO(
                match.getId(),
                match.getGame().getTitle(),
                match.getGame().getId(),
                match.getPlayer1().getUsername(),
                match.getPlayer1().getId(),
                match.getStatus(),
                match.getMatchType()
        );
    }
}
