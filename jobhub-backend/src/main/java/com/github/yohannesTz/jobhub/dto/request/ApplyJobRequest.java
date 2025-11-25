package com.github.yohannesTz.jobhub.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyJobRequest {
    
    private String message;
    
    private Boolean useStoredResume = true;
    
    private String resumeUrl;
}

