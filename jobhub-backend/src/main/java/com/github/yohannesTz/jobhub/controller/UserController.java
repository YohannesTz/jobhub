package com.github.yohannesTz.jobhub.controller;

import com.github.yohannesTz.jobhub.dto.request.FileUploadRequest;
import com.github.yohannesTz.jobhub.dto.request.UpdateUserRequest;
import com.github.yohannesTz.jobhub.dto.response.ApiResponse;
import com.github.yohannesTz.jobhub.dto.response.PresignedUrlResponse;
import com.github.yohannesTz.jobhub.dto.response.UserResponse;
import com.github.yohannesTz.jobhub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse response = userService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(@Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateCurrentUser(request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", response));
    }
    
    @PostMapping("/me/profile-picture/upload-url")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getProfilePictureUploadUrl(
            @Valid @RequestBody FileUploadRequest request) {
        PresignedUrlResponse response = userService.generateProfilePictureUploadUrl(
                request.getFileName(), 
                request.getContentType()
        );
        return ResponseEntity.ok(ApiResponse.success("Presigned URL generated", response));
    }
    
    @PostMapping("/me/profile-picture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfilePicture(@RequestBody Map<String, String> body) {
        String fileUrl = body.get("fileUrl");
        UserResponse response = userService.updateProfilePicture(fileUrl);
        return ResponseEntity.ok(ApiResponse.success("Profile picture updated", response));
    }
    
    @PostMapping("/me/resume/upload-url")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getResumeUploadUrl(
            @Valid @RequestBody FileUploadRequest request) {
        PresignedUrlResponse response = userService.generateResumeUploadUrl(
                request.getFileName(), 
                request.getContentType()
        );
        return ResponseEntity.ok(ApiResponse.success("Presigned URL generated", response));
    }
    
    @PostMapping("/me/resume")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> updateResume(@RequestBody Map<String, String> body) {
        String fileUrl = body.get("fileUrl");
        UserResponse response = userService.updateResume(fileUrl);
        return ResponseEntity.ok(ApiResponse.success("Resume updated", response));
    }
}

