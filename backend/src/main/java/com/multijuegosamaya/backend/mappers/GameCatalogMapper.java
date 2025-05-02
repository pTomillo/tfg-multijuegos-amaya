package com.multijuegosamaya.backend.mappers;

import com.multijuegosamaya.backend.dto.GameCatalogDTO;
import com.multijuegosamaya.backend.model.Game;

public class GameCatalogMapper {
    public static GameCatalogDTO toDTO(Game game) {
        return new GameCatalogDTO(
                game.getId(),
                game.getTitle(),
                game.getDescription()
        );
    }
}
