package com.github.yohannesTz.jobhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCompanyRequest {
    
    @NotBlank(message = "Company name is required")
    private String name;
    
    private String description;
    
    private String website;
}

