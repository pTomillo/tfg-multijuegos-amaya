package com.multijuegosamaya.backend.service;

import com.multijuegosamaya.backend.dto.GameCatalogDTO;
import com.multijuegosamaya.backend.mappers.GameCatalogMapper;
import com.multijuegosamaya.backend.model.Game;
import com.multijuegosamaya.backend.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameCatalogService {

    private final GameRepository gameRepository;

    public List<GameCatalogDTO> getGamesCatalog() {
        List<Game> games = gameRepository.findAll();
        List<GameCatalogDTO> gamesList = games.stream().map(GameCatalogMapper::toDTO).toList();
        return gamesList;
    }

    public GameCatalogDTO getGame(Long gameId) {
        Game game = gameRepository.findById(gameId).get();
        GameCatalogDTO gameDTO = GameCatalogMapper.toDTO(game);
        return gameDTO;
    }
}
