package com.multijuegosamaya.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordDTO {
    String password;
    String newPassword;
}
