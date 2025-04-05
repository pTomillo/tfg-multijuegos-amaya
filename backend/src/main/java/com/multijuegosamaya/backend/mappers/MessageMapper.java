package com.multijuegosamaya.backend.mappers;

import com.multijuegosamaya.backend.dto.MessageDTO;
import com.multijuegosamaya.backend.model.Message;
import com.multijuegosamaya.backend.model.User;

import java.time.LocalDateTime;

public class MessageMapper {

    public static MessageDTO toDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderUsername(message.getSender().getUsername())
                .recipientId(message.getRecipient().getId())
                .recipientUsername(message.getRecipient().getUsername())
                .content(message.getContent())
                .date(message.getDate())
                .build();
    }

    public static Message toEntity(MessageDTO messageDTO, User sender, User recipient) {
        return Message.builder()
                .id(messageDTO.getId())
                .sender(sender)
                .recipient(recipient)
                .content(messageDTO.getContent())
                .date(messageDTO.getDate())
                .build();
    }
}
