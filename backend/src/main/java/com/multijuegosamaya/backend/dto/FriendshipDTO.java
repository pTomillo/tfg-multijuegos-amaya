package com.multijuegosamaya.backend.dto;


import com.multijuegosamaya.backend.model.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendshipDTO {
    private Long id;
    private Long user1Id;
    private Long user2Id;
    private String status;
    private LocalDateTime date;
}
