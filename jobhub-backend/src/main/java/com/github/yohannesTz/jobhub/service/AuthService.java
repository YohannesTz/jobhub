package com.github.yohannesTz.jobhub.service;

import com.github.yohannesTz.jobhub.dto.request.LoginRequest;
import com.github.yohannesTz.jobhub.dto.request.RegisterRequest;
import com.github.yohannesTz.jobhub.dto.response.AuthResponse;
import com.github.yohannesTz.jobhub.dto.response.UserResponse;
import com.github.yohannesTz.jobhub.entity.RefreshToken;
import com.github.yohannesTz.jobhub.entity.User;
import com.github.yohannesTz.jobhub.entity.UserRole;
import com.github.yohannesTz.jobhub.exception.BadRequestException;
import com.github.yohannesTz.jobhub.repository.UserRepository;
import com.github.yohannesTz.jobhub.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate role is not ADMIN
        if (request.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("Cannot register as ADMIN");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        // Create user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        
        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());
        
        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserResponse(user))
                .build();
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        log.info("User logged in successfully: {}", user.getEmail());
        
        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserResponse(user))
                .build();
    }
    
    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshTokenStr);
        
        User user = refreshToken.getUser();
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        
        log.info("Access token refreshed for user: {}", user.getEmail());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserResponse(user))
                .build();
    }
    
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profilePictureUrl(user.getProfilePictureUrl())
                .resumeUrl(user.getResumeUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

