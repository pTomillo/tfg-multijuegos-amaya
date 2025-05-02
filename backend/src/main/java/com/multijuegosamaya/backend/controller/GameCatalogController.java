package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.GameCatalogDTO;
import com.multijuegosamaya.backend.service.GameCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/gameCatalog")
public class GameCatalogController {
    @Autowired
    private GameCatalogService gameCatalogService;

    @GetMapping("/list")
    public List<GameCatalogDTO> getGames() {
      return  gameCatalogService.getGamesCatalog();
    }

    @GetMapping("/{gameId}")
    public GameCatalogDTO getGame(@PathVariable Long gameId) {
        return gameCatalogService.getGame(gameId);
    }

}
