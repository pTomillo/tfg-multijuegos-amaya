package com.multijuegosamaya.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String profilePicture;
    private Boolean onlineStatus;
}
