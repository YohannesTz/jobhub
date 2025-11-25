package com.github.yohannesTz.jobhub.service;

import com.github.yohannesTz.jobhub.dto.response.PresignedUrlResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {
    
    private final S3Presigner s3Presigner;
    
    @Value("${aws.s3.bucket-name}")
    private String bucketName;
    
    @Value("${aws.s3.region}")
    private String region;
    
    public PresignedUrlResponse generatePresignedUrl(String fileName, String contentType, String folder) {
        String key = folder + "/" + UUID.randomUUID() + "-" + fileName;
        
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();
        
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();
        
        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
        
        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", 
                bucketName, region, key);
        
        log.info("Generated presigned URL for key: {}", key);
        
        return PresignedUrlResponse.builder()
                .uploadUrl(presignedRequest.url().toString())
                .fileUrl(fileUrl)
                .key(key)
                .build();
    }
}

