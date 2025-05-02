package com.multijuegosamaya.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameCatalogDTO {
    private Long id;
    private String title;
    private String description;
}
