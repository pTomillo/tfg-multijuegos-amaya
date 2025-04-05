package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
}
