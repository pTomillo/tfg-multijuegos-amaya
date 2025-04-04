package com.multijuegosamaya.backend.model;

import com.multijuegosamaya.backend.model.enums.FriendshipStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "friendships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "usuario2_id", nullable = false)
    private User user2;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendshipStatus status;

    private LocalDateTime date =  LocalDateTime.now();
}
