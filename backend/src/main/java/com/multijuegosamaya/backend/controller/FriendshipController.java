package com.multijuegosamaya.backend.controller;

import com.multijuegosamaya.backend.dto.FriendshipDTO;
import com.multijuegosamaya.backend.dto.UserDTO;
import com.multijuegosamaya.backend.mappers.FriendshipMapper;
import com.multijuegosamaya.backend.repository.FriendshipRepository;
import com.multijuegosamaya.backend.repository.UserRepository;
import com.multijuegosamaya.backend.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipMapper friendshipMapper;
    private final FriendshipService friendshipService;


    // Send friendship request
    @PostMapping("/request/{recipientId}")
    public ResponseEntity<FriendshipDTO> sendFriendRequest(@PathVariable Long recipientId) {
        // Retrieve the User that sends the request
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Create the friendship
        FriendshipDTO friendshipDTO = friendshipService.sendFriendshipRequest(recipientId, authentication);
        // Return the friendship
        return ResponseEntity.ok(friendshipDTO);
    }

    // Accept friendship request
    @PutMapping("/accept/{friendshipId}")
    public ResponseEntity<FriendshipDTO> acceptFriendship(@PathVariable Long friendshipId) {
        // Get the user that is accepting the request
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Update the status of the friendship
        FriendshipDTO friendshipDTO = friendshipService.acceptFriendRequest(friendshipId, authentication);
        return ResponseEntity.ok(friendshipDTO);
    }

    // Reject friendship request
    @DeleteMapping("/reject/{friendshipId}")
    public ResponseEntity<String> rejectFriendship(@PathVariable Long friendshipId) {
        // Get the user that is rejecting the request
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Update the status and delete the friendship
        friendshipService.rejectFriendshipRequest(friendshipId, authentication);
        return ResponseEntity.ok("Friendship request rejected succesfully");
    }

    // Get the request sent and peding
    @GetMapping("/requestSent")
    public ResponseEntity<List<FriendshipDTO>> requestFriendshipSent() {
        // Get the user making the request
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Return the
        return ResponseEntity.ok(friendshipService.getSentRequest(authentication));
    }

    // Get the request recieved and pending
    @GetMapping("/recievedRequest")
    public ResponseEntity<List<FriendshipDTO>> recievedFriendshipRequest() {
        // Get the user making the request
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Return the request recieved
        return ResponseEntity.ok(friendshipService.getRecievedRequest(authentication));
    }

    // List friends of a user
    @GetMapping("/listOfFriends")
    public ResponseEntity<List<UserDTO>> getFriendships() {
        // Get the user making the request
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Return the friends of the user
        return ResponseEntity.ok(friendshipService.getFriends(authentication));
    }

    // Delete a friendship
    @DeleteMapping("/deleteFriend/{friendId}")
    public ResponseEntity<?> deleteFriendship(@PathVariable Long friendId) {
        // Get the user making the request
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Delete the friendship
        friendshipService.deteleFriendship(friendId, authentication);
        // Notify the user
        return ResponseEntity.ok("Friendship deleted succesfully");
    }



}
