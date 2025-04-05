package com.multijuegosamaya.backend.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtRequest implements Serializable {
    private static final long serialVersionUID = 6406595684997185201L;
    private String username;
    private String password;
}
