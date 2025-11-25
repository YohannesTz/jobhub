package com.github.yohannesTz.jobhub.repository;

import com.github.yohannesTz.jobhub.entity.Company;
import com.github.yohannesTz.jobhub.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByCompany(Company company);
    
    @Query("SELECT j FROM Job j WHERE " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Job> searchJobs(@Param("keyword") String keyword, Pageable pageable);
    
    Page<Job> findAllByOrderByPostedAtDesc(Pageable pageable);
}

