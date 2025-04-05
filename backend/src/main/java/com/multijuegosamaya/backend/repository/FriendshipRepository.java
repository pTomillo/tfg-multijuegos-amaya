package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
}
