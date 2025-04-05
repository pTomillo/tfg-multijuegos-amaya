package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}
