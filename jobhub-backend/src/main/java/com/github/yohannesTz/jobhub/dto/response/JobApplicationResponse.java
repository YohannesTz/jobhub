package com.github.yohannesTz.jobhub.dto.response;

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
public class JobApplicationResponse {
    
    private UUID id;
    
    private UUID jobId;
    
    private String jobTitle;
    
    private UUID userId;
    
    private String userName;
    
    private String userEmail;
    
    private String message;
    
    private String resumeUrl;
    
    private LocalDateTime appliedAt;
}

