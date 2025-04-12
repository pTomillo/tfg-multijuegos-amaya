package com.multijuegosamaya.backend.service;

import com.multijuegosamaya.backend.dto.FriendshipDTO;
import com.multijuegosamaya.backend.dto.UserDTO;
import com.multijuegosamaya.backend.mappers.FriendshipMapper;
import com.multijuegosamaya.backend.mappers.UserMapper;
import com.multijuegosamaya.backend.model.Friendship;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.model.enums.FriendshipStatus;
import com.multijuegosamaya.backend.repository.FriendshipRepository;
import com.multijuegosamaya.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final JwtUserDetailsService jwtUserDetailsService;
    private final FriendshipMapper friendshipMapper;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;


    public FriendshipDTO sendFriendshipRequest(Long recipientId, Authentication authentication) {
        // Search for the sender Id
        Long senderId = jwtUserDetailsService.getUserId(authentication.getName());

        // Search for the sender and recipient User
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("User not found"));
        User recipient = userRepository.findById(recipientId).orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the users are already friends
        if (friendshipRepository.existsByUser1AndUser2(sender, recipient) || friendshipRepository.existsByUser1AndUser2(recipient, sender)) {
            throw new RuntimeException("Friendship already exists");
        }

        // Create the friendship, setting the status to pending
        Friendship friendship = new Friendship();
        friendship.setUser1(sender);
        friendship.setUser2(recipient);
        friendship.setStatus(FriendshipStatus.PENDING);

        // Save the friendshipt to the repository
        friendshipRepository.save(friendship);

        return friendshipMapper.toDTO(friendship);
    }

    public FriendshipDTO acceptFriendRequest(Long friendshipId, Authentication authentication) {
        // Get the user that is accepting the request
        Long recipientId = jwtUserDetailsService.getUserId(authentication.getName());
        User recipientUser = userRepository.findById(recipientId).orElseThrow(() -> new RuntimeException("User not found"));

        // Retrieve the friendship from the database
        Friendship friendship = friendshipRepository.findById(friendshipId).orElseThrow(() -> new RuntimeException("Friendship not found"));

        // Check that the user accepting is the User2 of the friendship and that the friendship is pending
        if(!friendship.getUser2().equals(recipientUser) && !friendship.getStatus().equals(FriendshipStatus.PENDING)) {
            throw new RuntimeException("Friendship does not belong to user");
        }

        // Update the friendship status
        friendship.setStatus(FriendshipStatus.ACCEPTED);

        // Save the friendship
        friendshipRepository.save(friendship);

        // Return the friendshipDTO
        return friendshipMapper.toDTO(friendship);
    }

    public void rejectFriendshipRequest(Long friendshipId, Authentication authentication) {
        // Get the user that is rejecting the request
        Long recipientId = jwtUserDetailsService.getUserId(authentication.getName());
        User recipientUser = userRepository.findById(recipientId).orElseThrow(() -> new RuntimeException("User not found"));

        // Retrieve the friendship from the database
        Friendship friendship = friendshipRepository.findById(friendshipId).orElseThrow(() -> new RuntimeException("Friendship not found"));

        // Update the friendship status
        friendship.setStatus(FriendshipStatus.REJECTED);

        // Delete the friendship
        friendshipRepository.delete(friendship);
    }

    public List<FriendshipDTO> getSentRequest(Authentication authentication) {
        // Retrieve the User Id
        Long userId = jwtUserDetailsService.getUserId(authentication.getName());

        // Find the User
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Search the request where User is User1
        List<Friendship> sentRequest = friendshipRepository.findByUser1AndStatus(user, FriendshipStatus.PENDING);

        // Map the list of friendship to a List of DTOs
        return sentRequest.stream().map(friendshipMapper::toDTO).toList();
    }

    public List<FriendshipDTO> getRecievedRequest(Authentication authentication) {
        // Retrieve the User ID
        Long userId = jwtUserDetailsService.getUserId(authentication.getName());

        // Find the User
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Search the request where User is user2 and the status is still pending
        List<Friendship> recievedRequest = friendshipRepository.findByUser2AndStatus(user, FriendshipStatus.PENDING);

        // Map the list of friendshipt to a List of DTOs
        return recievedRequest.stream().map(friendshipMapper::toDTO).toList();
    }

    public List<UserDTO> getFriends(Authentication authentication) {
        // Retrieve the User Id
        Long userId = jwtUserDetailsService.getUserId(authentication.getName());
        // Find the User
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // Get Friendships where the User making the request is User1
        List<Friendship> friendshippsAsUser1 = friendshipRepository.findByUser1AndStatus(user, FriendshipStatus.ACCEPTED);

        // Get Friendships where the User making the request is User2
        List<Friendship> friendshipsAsUser2 = friendshipRepository.findByUser2AndStatus(user, FriendshipStatus.ACCEPTED);

        // Map the opposite Users
        List<User> friends = new ArrayList<>(friendshippsAsUser1.stream()
                .map(Friendship::getUser2)
                .toList());

        friends.addAll(friendshipsAsUser2.stream()
                .map(Friendship::getUser1)
                .toList());

        // Transform User List to List of UserDTO
        List<UserDTO> friendsList = friends.stream().map(UserMapper::toUserDTO).toList();

        // Return the list of Users.
        return friendsList;
    }

    public void deteleFriendship(Long friendId, Authentication authentication) {
        // Retrieve the User ID
        Long userId = jwtUserDetailsService.getUserId(authentication.getName());
        // Find the user in the DB
        User user1 = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // Find the other user in the friendship
        User user2 = userRepository.findById(friendId).orElseThrow(() -> new RuntimeException("User not found"));
        // Get the friendship by the ID
        Friendship friendship = friendshipRepository.findFriendshipBetween(user1, user2).orElseThrow(() -> new RuntimeException("Friendship not found"));
        // Check that the user is one of the two possible friends
        if (user1 != friendship.getUser1() && user1 != friendship.getUser2()) {
            throw new RuntimeException("Friendship does not belong to user");
        }
        // Delete the friendship
        friendshipRepository.delete(friendship);
    }
}
