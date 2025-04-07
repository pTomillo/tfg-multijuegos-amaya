package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.MessageDTO;
import com.multijuegosamaya.backend.repository.MessageRepository;
import com.multijuegosamaya.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final MessageService messageService;

    @MessageMapping("/chat")
    public void send(MessageDTO messageDTO) {
        messageService.sendAndSaveMessage(messageDTO);
        System.out.println("Enviando DTO a guardar");
    }


}
