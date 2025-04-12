package com.multijuegosamaya.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix for the messages send from the client to the server
        registry.setApplicationDestinationPrefixes("/app");

        // Prefix for a simple broker that sends the message from the server to the cliente
        registry.enableSimpleBroker("/topic", "/queue");

        // Prefix for private messaging
        registry.setUserDestinationPrefix("/user");
    }
}
