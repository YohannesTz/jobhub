package com.github.yohannesTz.jobhub.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobRequest {
    
    private String title;
    
    private String description;
    
    private String requirements;
    
    private String location;
    
    private BigDecimal salary;
}

