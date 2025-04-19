package com.multijuegosamaya.backend.service.game;

import com.multijuegosamaya.backend.service.game.engine.GameEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GameEngineFactory {

    private final Map<String, GameEngine> gameEngines;

    @Autowired
    public GameEngineFactory(List<GameEngine> gameEnginesList) {
        this.gameEngines = new HashMap<>();
        for (GameEngine gameEngine : gameEnginesList) {
            String key = gameEngine.getClass().getAnnotation(Service.class).value();
            gameEngines.put(key.toUpperCase(), gameEngine);
        }
    }

    public GameEngine getGameEngine(String gameKey) {
        return gameEngines.get(gameKey.toUpperCase());
    }
}
