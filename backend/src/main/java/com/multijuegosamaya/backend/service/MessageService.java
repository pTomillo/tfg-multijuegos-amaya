package com.multijuegosamaya.backend.service;

import com.multijuegosamaya.backend.dto.MessageDTO;
import com.multijuegosamaya.backend.mappers.MessageMapper;
import com.multijuegosamaya.backend.model.Message;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.repository.MessageRepository;
import com.multijuegosamaya.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtUserDetailsService userDetailsService;
    private final JwtUserDetailsService jwtUserDetailsService;

    // Save a message and send it to the destinatary via WebSocket
    public MessageDTO sendAndSaveMessage(MessageDTO messageDTO) {
        System.out.println("Recibiendo DTO para guardar");

        // Search the users that are part of the conversation
        User sender = userRepository.findById(messageDTO.getSenderId()).orElseThrow(() -> new RuntimeException("User not found"));
        User recipient = userRepository.findById(messageDTO.getRecipientId()).orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Usuarios Encontrados");

        // Build a message
        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(messageDTO.getContent())
                .date(LocalDateTime.now())
                .build();

        // Save it to the database
        messageRepository.save(message);

        System.out.println("Mensaje: "+ message);

        // Convert the message
        MessageDTO response = MessageMapper.toDTO(message);

        // Send the message to the recipient via websocket
        // Enviar a un canal público específico para el userId
        messagingTemplate.convertAndSend(
                "/topic/messages/" + recipient.getId(),
                response
        );
        return response;
    }

    public List<MessageDTO> getConversation(Authentication user1, Long user2Id) {
        Long user1Id = jwtUserDetailsService.getUserId(user1.getName());

        List<Message> messages = messageRepository.findByUsers(user1Id, user2Id);
        return messages.stream()
                .map(MessageMapper::toDTO)
                .toList();
    }
}
