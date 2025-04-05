package com.multijuegosamaya.backend.service;

import com.multijuegosamaya.backend.dto.PasswordDTO;
import com.multijuegosamaya.backend.dto.RegistrationRequest;
import com.multijuegosamaya.backend.dto.UserDTO;
import com.multijuegosamaya.backend.mappers.UserMapper;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.model.enums.Role;
import com.multijuegosamaya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Registers a new User
    public User registerUser(RegistrationRequest registrationRequest) {
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setEmail(registrationRequest.getEmail());
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    // List one User
    public UserDTO findUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toUserDTO(user);
    }

    // List all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserMapper::toUserDTO).toList();
    }

    // Update User
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Change information of the user
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setProfilePicture(userDTO.getProfilePicture());

        // Save the information
        User updated = userRepository.save(user);

        // Return updated user
        return UserMapper.toUserDTO(updated);
    }

    // Delete User
    public void deleteUser(Long id) {
        // Search for the user in the database
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        // Delete the user
        userRepository.delete(user);
    }

    // Update Password
    public void changePassword(Long id, PasswordDTO passwordDTO) {
        // Find the user in the database
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the old password is correct
        if (!passwordEncoder.matches(passwordDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        // Upodate the password
        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userRepository.save(user);
    }
}
