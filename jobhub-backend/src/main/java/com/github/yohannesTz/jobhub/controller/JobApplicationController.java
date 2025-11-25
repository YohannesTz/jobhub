package com.github.yohannesTz.jobhub.controller;

import com.github.yohannesTz.jobhub.dto.request.ApplyJobRequest;
import com.github.yohannesTz.jobhub.dto.response.ApiResponse;
import com.github.yohannesTz.jobhub.dto.response.JobApplicationResponse;
import com.github.yohannesTz.jobhub.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class JobApplicationController {
    
    private final JobApplicationService applicationService;
    
    @PostMapping("/jobs/{jobId}/apply")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> applyToJob(
            @PathVariable UUID jobId,
            @Valid @RequestBody ApplyJobRequest request) {
        JobApplicationResponse response = applicationService.applyToJob(jobId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }
    
    @GetMapping("/jobs/{jobId}/applications")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getApplicationsForJob(@PathVariable UUID jobId) {
        List<JobApplicationResponse> response = applicationService.getApplicationsForJob(jobId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/applications/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getMyApplications() {
        List<JobApplicationResponse> response = applicationService.getMyApplications();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/applications/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getApplicationById(@PathVariable UUID id) {
        JobApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

