package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
