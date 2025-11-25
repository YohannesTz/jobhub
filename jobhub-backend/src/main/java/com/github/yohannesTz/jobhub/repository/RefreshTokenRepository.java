package com.github.yohannesTz.jobhub.repository;

import com.github.yohannesTz.jobhub.entity.RefreshToken;
import com.github.yohannesTz.jobhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}

