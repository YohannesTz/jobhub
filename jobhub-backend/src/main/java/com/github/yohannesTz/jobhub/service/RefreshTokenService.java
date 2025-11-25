package com.github.yohannesTz.jobhub.service;

import com.github.yohannesTz.jobhub.entity.RefreshToken;
import com.github.yohannesTz.jobhub.entity.User;
import com.github.yohannesTz.jobhub.exception.UnauthorizedException;
import com.github.yohannesTz.jobhub.repository.RefreshTokenRepository;
import com.github.yohannesTz.jobhub.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    
    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;
    
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Delete old refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);
        
        String token = jwtUtil.generateRefreshToken(user.getEmail());
        
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .createdAt(LocalDateTime.now())
                .build();
        
        return refreshTokenRepository.save(refreshToken);
    }
    
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token expired");
        }
        
        return refreshToken;
    }
}

