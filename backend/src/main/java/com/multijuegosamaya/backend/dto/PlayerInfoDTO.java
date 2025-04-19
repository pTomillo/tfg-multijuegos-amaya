package com.multijuegosamaya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerInfoDTO {
    private Long id;
    private String username;
    private String avatarUrl;
}
