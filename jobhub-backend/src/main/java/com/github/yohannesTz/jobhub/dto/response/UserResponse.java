package com.github.yohannesTz.jobhub.dto.response;

import com.github.yohannesTz.jobhub.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private UUID id;
    
    private String name;
    
    private String email;
    
    private UserRole role;
    
    private String profilePictureUrl;
    
    private String resumeUrl;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

