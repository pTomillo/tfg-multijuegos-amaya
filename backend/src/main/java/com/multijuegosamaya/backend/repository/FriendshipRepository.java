package com.multijuegosamaya.backend.repository;

import com.multijuegosamaya.backend.model.Friendship;
import com.multijuegosamaya.backend.model.User;
import com.multijuegosamaya.backend.model.enums.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    boolean existsByUser1AndUser2(User sender, User recipient);

    List<Friendship> findByUser1AndStatus(User user, FriendshipStatus pending);

    List<Friendship> findByUser2AndStatus(User user, FriendshipStatus friendshipStatus);

    @Query("SELECT f FROM Friendship f WHERE " +
            "(f.user1 = :userA AND f.user2 = :userB) OR " +
            "(f.user1 = :userB AND f.user2 = :userA)")
    Optional<Friendship> findFriendshipBetween(@Param("userA") User userA, @Param("userB") User userB);

}
