package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.RegistrationRequest;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RegistrationController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest registrationRequest) {
        User user = userService.registerUser(registrationRequest);
        return ResponseEntity.ok("User registered successfully");
    }
}
