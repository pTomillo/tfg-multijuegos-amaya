package com.multijuegosamaya.backend.mappers;

import com.multijuegosamaya.backend.dto.UserDTO;
import com.multijuegosamaya.backend.model.User;

public class UserMapper {

    public static UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .build();
    }

    public static User toUser(UserDTO userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .profilePicture(userDTO.getProfilePicture())
                .build();
    }
}
