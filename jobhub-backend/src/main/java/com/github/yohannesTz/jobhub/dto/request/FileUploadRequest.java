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
public class FileUploadRequest {
    
    @NotBlank(message = "File name is required")
    private String fileName;
    
    @NotBlank(message = "Content type is required")
    private String contentType;
}

