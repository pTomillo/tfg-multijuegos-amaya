package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface RoundRepository extends JpaRepository<Round, Long> {
}
