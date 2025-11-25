package com.github.yohannesTz.jobhub.service;

import com.github.yohannesTz.jobhub.dto.request.UpdateUserRequest;
import com.github.yohannesTz.jobhub.dto.response.PresignedUrlResponse;
import com.github.yohannesTz.jobhub.dto.response.UserResponse;
import com.github.yohannesTz.jobhub.entity.User;
import com.github.yohannesTz.jobhub.exception.BadRequestException;
import com.github.yohannesTz.jobhub.exception.ResourceNotFoundException;
import com.github.yohannesTz.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final S3Service s3Service;
    
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public UserResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return mapToUserResponse(user);
    }
    
    @Transactional
    public UserResponse updateCurrentUser(UpdateUserRequest request) {
        User user = getCurrentUser();
        
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(user.getEmail()) && 
                userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        
        user = userRepository.save(user);
        log.info("User profile updated: {}", user.getEmail());
        
        return mapToUserResponse(user);
    }
    
    public PresignedUrlResponse generateProfilePictureUploadUrl(String fileName, String contentType) {
        return s3Service.generatePresignedUrl(fileName, contentType, "profile-pictures");
    }
    
    @Transactional
    public UserResponse updateProfilePicture(String fileUrl) {
        User user = getCurrentUser();
        user.setProfilePictureUrl(fileUrl);
        user = userRepository.save(user);
        
        log.info("Profile picture updated for user: {}", user.getEmail());
        
        return mapToUserResponse(user);
    }
    
    public PresignedUrlResponse generateResumeUploadUrl(String fileName, String contentType) {
        return s3Service.generatePresignedUrl(fileName, contentType, "resumes");
    }
    
    @Transactional
    public UserResponse updateResume(String fileUrl) {
        User user = getCurrentUser();
        user.setResumeUrl(fileUrl);
        user = userRepository.save(user);
        
        log.info("Resume updated for user: {}", user.getEmail());
        
        return mapToUserResponse(user);
    }
    
    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
    
    @Transactional
    public void deleteUser(UUID userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
        log.info("User deleted: {}", user.getEmail());
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

