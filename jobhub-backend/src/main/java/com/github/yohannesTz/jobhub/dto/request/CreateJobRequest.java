package com.github.yohannesTz.jobhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {
    
    @NotBlank(message = "Job title is required")
    private String title;
    
    @NotBlank(message = "Job description is required")
    private String description;
    
    private String requirements;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private BigDecimal salary;
    
    @NotNull(message = "Company ID is required")
    private UUID companyId;
}

