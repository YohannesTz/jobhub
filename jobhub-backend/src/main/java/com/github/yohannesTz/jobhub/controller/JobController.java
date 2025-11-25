package com.github.yohannesTz.jobhub.controller;

import com.github.yohannesTz.jobhub.dto.request.CreateJobRequest;
import com.github.yohannesTz.jobhub.dto.request.UpdateJobRequest;
import com.github.yohannesTz.jobhub.dto.response.ApiResponse;
import com.github.yohannesTz.jobhub.dto.response.JobResponse;
import com.github.yohannesTz.jobhub.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {
    
    private final JobService jobService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody CreateJobRequest request) {
        JobResponse response = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job created successfully", response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<JobResponse> response = jobService.searchJobs(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable UUID id) {
        JobResponse response = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable UUID id, 
            @Valid @RequestBody UpdateJobRequest request) {
        JobResponse response = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", response));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable UUID id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }
}

