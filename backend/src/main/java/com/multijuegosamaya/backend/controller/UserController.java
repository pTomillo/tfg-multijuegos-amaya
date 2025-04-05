package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.PasswordDTO;
import com.multijuegosamaya.backend.dto.UserDTO;
import com.multijuegosamaya.backend.mappers.UserMapper;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/")
public class UserController {

    @Autowired
    private UserService userService;

    // List one User
    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO userDTO = userService.findUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    // List all Users
    @GetMapping("/users/")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> userDTO = userService.getAllUsers();
        return ResponseEntity.ok(userDTO);
    }

    // Update a User
    @PutMapping("/user/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        UserDTO updatedUserDTO = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUserDTO);
    }

    // Delete a User
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted succesfully");
    }

    // Update Password of a User
    @PutMapping("/user/{id}/password")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long id, @RequestBody PasswordDTO passwordDTO) {
        userService.changePassword(id, passwordDTO);
        return ResponseEntity.ok("Password updated succesfully");
    }
}
