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
public class CompanyResponse {
    
    private UUID id;
    
    private String name;
    
    private String description;
    
    private String website;
    
    private UUID ownerId;
    
    private String ownerName;
    
    private LocalDateTime createdAt;
}

