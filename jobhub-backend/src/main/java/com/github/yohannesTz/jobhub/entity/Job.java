package com.github.yohannesTz.jobhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotBlank(message = "Job title is required")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Job description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String requirements;
    
    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal salary;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @CreationTimestamp
    @Column(name = "posted_at", updatable = false)
    private LocalDateTime postedAt;
}

