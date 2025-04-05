package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}
