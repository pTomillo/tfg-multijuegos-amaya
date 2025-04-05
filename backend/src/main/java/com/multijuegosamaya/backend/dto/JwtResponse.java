package com.multijuegosamaya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class JwtResponse implements Serializable {

    private static final long serialVersionUID = 7861465150358331936L;
    private final String jwttoken;
    private final Long userId;

    public JwtResponse(String jwttoken, Long userId) {
        this.jwttoken = jwttoken;
        this.userId = userId;
    }

    public Long getUserId() {
        return this.userId;
    }
}
