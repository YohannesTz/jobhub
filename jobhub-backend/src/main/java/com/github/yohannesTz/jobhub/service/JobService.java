package com.github.yohannesTz.jobhub.service;

import com.github.yohannesTz.jobhub.dto.request.CreateJobRequest;
import com.github.yohannesTz.jobhub.dto.request.UpdateJobRequest;
import com.github.yohannesTz.jobhub.dto.response.JobResponse;
import com.github.yohannesTz.jobhub.entity.Company;
import com.github.yohannesTz.jobhub.entity.Job;
import com.github.yohannesTz.jobhub.entity.User;
import com.github.yohannesTz.jobhub.entity.UserRole;
import com.github.yohannesTz.jobhub.exception.ResourceNotFoundException;
import com.github.yohannesTz.jobhub.exception.UnauthorizedException;
import com.github.yohannesTz.jobhub.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {
    
    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final UserService userService;
    
    @Transactional
    public JobResponse createJob(CreateJobRequest request) {
        User currentUser = userService.getCurrentUser();
        Company company = companyService.findCompanyById(request.getCompanyId());
        
        // Check if user owns the company
        if (!company.getOwner().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You don't have permission to create jobs for this company");
        }
        
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .location(request.getLocation())
                .salary(request.getSalary())
                .company(company)
                .build();
        
        job = jobRepository.save(job);
        log.info("Job created: {} for company: {}", job.getTitle(), company.getName());
        
        return mapToJobResponse(job);
    }
    
    public Page<JobResponse> searchJobs(String keyword, Pageable pageable) {
        Page<Job> jobs;
        if (keyword != null && !keyword.isBlank()) {
            jobs = jobRepository.searchJobs(keyword, pageable);
        } else {
            jobs = jobRepository.findAllByOrderByPostedAtDesc(pageable);
        }
        return jobs.map(this::mapToJobResponse);
    }
    
    public JobResponse getJobById(UUID jobId) {
        Job job = findJobById(jobId);
        return mapToJobResponse(job);
    }
    
    @Transactional
    public JobResponse updateJob(UUID jobId, UpdateJobRequest request) {
        Job job = findJobById(jobId);
        User currentUser = userService.getCurrentUser();
        
        // Check ownership
        if (!job.getCompany().getOwner().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You don't have permission to update this job");
        }
        
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            job.setTitle(request.getTitle());
        }
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            job.setDescription(request.getDescription());
        }
        if (request.getRequirements() != null) {
            job.setRequirements(request.getRequirements());
        }
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            job.setLocation(request.getLocation());
        }
        if (request.getSalary() != null) {
            job.setSalary(request.getSalary());
        }
        
        job = jobRepository.save(job);
        log.info("Job updated: {}", job.getTitle());
        
        return mapToJobResponse(job);
    }
    
    @Transactional
    public void deleteJob(UUID jobId) {
        Job job = findJobById(jobId);
        User currentUser = userService.getCurrentUser();
        
        // Check ownership
        if (!job.getCompany().getOwner().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You don't have permission to delete this job");
        }
        
        jobRepository.delete(job);
        log.info("Job deleted: {}", job.getTitle());
    }
    
    public Job findJobById(UUID jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
    }
    
    private JobResponse mapToJobResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .salary(job.getSalary())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .postedAt(job.getPostedAt())
                .build();
    }
}

