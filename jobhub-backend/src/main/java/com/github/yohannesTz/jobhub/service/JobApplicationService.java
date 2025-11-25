package com.github.yohannesTz.jobhub.service;

import com.github.yohannesTz.jobhub.dto.request.ApplyJobRequest;
import com.github.yohannesTz.jobhub.dto.response.JobApplicationResponse;
import com.github.yohannesTz.jobhub.entity.Job;
import com.github.yohannesTz.jobhub.entity.JobApplication;
import com.github.yohannesTz.jobhub.entity.User;
import com.github.yohannesTz.jobhub.entity.UserRole;
import com.github.yohannesTz.jobhub.exception.BadRequestException;
import com.github.yohannesTz.jobhub.exception.ResourceNotFoundException;
import com.github.yohannesTz.jobhub.exception.UnauthorizedException;
import com.github.yohannesTz.jobhub.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobApplicationService {
    
    private final JobApplicationRepository applicationRepository;
    private final JobService jobService;
    private final UserService userService;
    
    @Transactional
    public JobApplicationResponse applyToJob(UUID jobId, ApplyJobRequest request) {
        User currentUser = userService.getCurrentUser();
        Job job = jobService.findJobById(jobId);
        
        // Users with USER role only
        if (currentUser.getRole() != UserRole.USER) {
            throw new BadRequestException("Only users with USER role can apply to jobs");
        }
        
        // Check if job belongs to user's own company (prevent self-application)
        if (job.getCompany().getOwner().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot apply to your own company's job");
        }
        
        // Check for duplicate application
        if (applicationRepository.existsByJobAndUser(job, currentUser)) {
            throw new BadRequestException("You have already applied to this job");
        }
        
        // Determine resume URL
        String resumeUrl;
        if (Boolean.TRUE.equals(request.getUseStoredResume())) {
            resumeUrl = currentUser.getResumeUrl();
            if (resumeUrl == null || resumeUrl.isBlank()) {
                throw new BadRequestException("No stored resume found. Please upload a resume first.");
            }
        } else {
            resumeUrl = request.getResumeUrl();
            if (resumeUrl == null || resumeUrl.isBlank()) {
                throw new BadRequestException("Resume URL is required");
            }
        }
        
        JobApplication application = JobApplication.builder()
                .job(job)
                .user(currentUser)
                .message(request.getMessage())
                .resumeUrl(resumeUrl)
                .build();
        
        application = applicationRepository.save(application);
        log.info("Application submitted by {} for job: {}", currentUser.getEmail(), job.getTitle());
        
        return mapToJobApplicationResponse(application);
    }
    
    public List<JobApplicationResponse> getApplicationsForJob(UUID jobId) {
        Job job = jobService.findJobById(jobId);
        User currentUser = userService.getCurrentUser();
        
        // Only company owner or admin can see applications
        if (!job.getCompany().getOwner().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You don't have permission to view these applications");
        }
        
        return applicationRepository.findByJob(job).stream()
                .map(this::mapToJobApplicationResponse)
                .collect(Collectors.toList());
    }
    
    public List<JobApplicationResponse> getMyApplications() {
        User currentUser = userService.getCurrentUser();
        
        return applicationRepository.findByUser(currentUser).stream()
                .map(this::mapToJobApplicationResponse)
                .collect(Collectors.toList());
    }
    
    public JobApplicationResponse getApplicationById(UUID applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        
        User currentUser = userService.getCurrentUser();
        
        // Check permission
        if (!application.getUser().getId().equals(currentUser.getId()) &&
            !application.getJob().getCompany().getOwner().getId().equals(currentUser.getId()) &&
            currentUser.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You don't have permission to view this application");
        }
        
        return mapToJobApplicationResponse(application);
    }
    
    private JobApplicationResponse mapToJobApplicationResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .userId(application.getUser().getId())
                .userName(application.getUser().getName())
                .userEmail(application.getUser().getEmail())
                .message(application.getMessage())
                .resumeUrl(application.getResumeUrl())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}

