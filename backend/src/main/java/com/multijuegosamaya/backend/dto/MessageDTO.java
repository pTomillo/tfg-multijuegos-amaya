package com.multijuegosamaya.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long recipientId;
    private String recipientUsername;
    private String content;
    private LocalDateTime date;

}
