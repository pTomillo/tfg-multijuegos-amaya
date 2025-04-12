package com.multijuegosamaya.backend.service.game.engine;

import com.multijuegosamaya.backend.dto.MoveDTO;

public interface GameEngine {
    void processMove(MoveDTO move);
}
