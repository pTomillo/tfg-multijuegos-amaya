package com.multijuegosamaya.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistrationRequest {
    private String Username;
    private String Email;
    private String Password;
}
