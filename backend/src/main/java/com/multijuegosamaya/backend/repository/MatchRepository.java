package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.Match;
import com.multijuegosamaya.backend.model.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByGameIdAndStatus(Long gameId, MatchStatus pending);

    @Query("SELECT m FROM Match m LEFT JOIN FETCH m.rounds WHERE m.id = :id")
    Optional<Match> findByIdWithRounds(@Param("id") Long id);
}
