package com.multijuegosamaya.backend.service;

import com.multijuegosamaya.backend.dto.RegistrationRequest;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.model.enums.Role;
import com.multijuegosamaya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(RegistrationRequest registrationRequest) {
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setEmail(registrationRequest.getEmail());
        user.setRole(Role.USER);

        return userRepository.save(user);
    }
}
