package com.multijuegosamaya.backend.mappers;

import com.multijuegosamaya.backend.dto.FriendshipDTO;
import com.multijuegosamaya.backend.model.Friendship;
import com.multijuegosamaya.backend.model.enums.FriendshipStatus;
import com.multijuegosamaya.backend.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class FriendshipMapper {

    private UserRepository userRepository;

    public FriendshipDTO toDTO(Friendship friendship) {
        FriendshipDTO friendshipDTO = new FriendshipDTO();
        friendshipDTO.setId(friendship.getId());
        friendshipDTO.setUser1Id(friendship.getUser1().getId());
        friendshipDTO.setUser2Id(friendship.getUser2().getId());
        friendshipDTO.setStatus(friendship.getStatus().toString());
        friendshipDTO.setDate(friendship.getDate());

        return friendshipDTO;
    }

    public Friendship toEntity(FriendshipDTO friendshipDTO) {
        Friendship friendship = new Friendship();
        friendship.setId(friendshipDTO.getId());
        friendship.setUser1(userRepository.findById(friendship.getUser1().getId()).orElseThrow(() -> new RuntimeException("User not found")));
        friendship.setUser2(userRepository.findById(friendship.getUser2().getId()).orElseThrow(() -> new RuntimeException("User not found")));
        friendship.setStatus(FriendshipStatus.valueOf(friendshipDTO.getStatus()));
        friendship.setDate(friendshipDTO.getDate());
        return friendship;
    }
}
