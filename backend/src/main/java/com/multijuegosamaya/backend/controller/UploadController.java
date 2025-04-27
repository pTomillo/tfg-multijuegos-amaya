package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.UserDTO;
import com.multijuegosamaya.backend.mappers.UserMapper;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.repository.UserRepository;
import com.multijuegosamaya.backend.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/upload")
public class UploadController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;
    @Autowired
    private UserMapper userMapper;

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = jwtUserDetailsService.getUserId(authentication.getName());
        Optional<User> userOptional = userRepository.findById(userId);

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        // Give it a random name
        String fileName = java.util.UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String uploadDir = "/uploads";

        // Create the folder
        File uploadPath = new File(uploadDir);
        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        // Save the file
        file.transferTo(new File(uploadPath, fileName));

        // Save the path to the file
        user.setProfilePicture("/uploads/" + fileName);

        // Save changes to the Db
        userRepository.save(user);

        // Return the updated user as a DTO
        UserDTO userDTO = userMapper.toUserDTO(user);
        return ResponseEntity.ok(userDTO);
    }

}
