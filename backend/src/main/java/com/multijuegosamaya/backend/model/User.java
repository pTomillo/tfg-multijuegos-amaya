package com.multijuegosamaya.backend.model;


import com.multijuegosamaya.backend.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class User {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true, nullable=false)
    private String username;

    @Column(unique=true, nullable=false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profilePicture; // Profile photo URL

    @Enumerated(EnumType.STRING)
    private Role role; // Either USER or ADMIN

    private Boolean onlineStatus;

}
