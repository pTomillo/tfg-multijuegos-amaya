package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.MoveDTO;
import com.multijuegosamaya.backend.service.game.engine.GameEngine;
import com.multijuegosamaya.backend.service.game.GameEngineFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {
    private final GameEngineFactory engineFactory;
    private final SimpMessagingTemplate messagingTemplate;

    public GameWebSocketController(GameEngineFactory engineFactory,SimpMessagingTemplate messagingTemplate) {
        this.engineFactory = engineFactory;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("game/move")
    public void handleMove(MoveDTO moveDTO) {
        System.out.println(moveDTO);
        // Get the adecuate game engine
        GameEngine engine = engineFactory.getGameEngine(moveDTO.getGameKey());
        if(engine != null) {
            engine.processMove(moveDTO);
        } else {
            throw new RuntimeException("No engine found for key: " + moveDTO.getGameKey());
        }
    }
}
