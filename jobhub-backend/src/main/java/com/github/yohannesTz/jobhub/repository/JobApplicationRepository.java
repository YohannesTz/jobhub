package com.github.yohannesTz.jobhub.repository;

import com.github.yohannesTz.jobhub.entity.Job;
import com.github.yohannesTz.jobhub.entity.JobApplication;
import com.github.yohannesTz.jobhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
    List<JobApplication> findByJob(Job job);
    List<JobApplication> findByUser(User user);
    Optional<JobApplication> findByJobAndUser(Job job, User user);
    boolean existsByJobAndUser(Job job, User user);
}

