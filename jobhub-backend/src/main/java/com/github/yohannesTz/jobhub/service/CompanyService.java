package com.github.yohannesTz.jobhub.service;

import com.github.yohannesTz.jobhub.dto.request.CreateCompanyRequest;
import com.github.yohannesTz.jobhub.dto.request.UpdateCompanyRequest;
import com.github.yohannesTz.jobhub.dto.response.CompanyResponse;
import com.github.yohannesTz.jobhub.entity.Company;
import com.github.yohannesTz.jobhub.entity.User;
import com.github.yohannesTz.jobhub.entity.UserRole;
import com.github.yohannesTz.jobhub.exception.BadRequestException;
import com.github.yohannesTz.jobhub.exception.ResourceNotFoundException;
import com.github.yohannesTz.jobhub.exception.UnauthorizedException;
import com.github.yohannesTz.jobhub.repository.CompanyRepository;
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
public class CompanyService {
    
    private final CompanyRepository companyRepository;
    private final UserService userService;
    
    @Transactional
    public CompanyResponse createCompany(CreateCompanyRequest request) {
        User currentUser = userService.getCurrentUser();
        
        if (currentUser.getRole() != UserRole.COMPANY && currentUser.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("Only users with COMPANY role can create companies");
        }
        
        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .website(request.getWebsite())
                .owner(currentUser)
                .build();
        
        company = companyRepository.save(company);
        log.info("Company created: {} by user: {}", company.getName(), currentUser.getEmail());
        
        return mapToCompanyResponse(company);
    }
    
    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToCompanyResponse)
                .collect(Collectors.toList());
    }
    
    public CompanyResponse getCompanyById(UUID companyId) {
        Company company = findCompanyById(companyId);
        return mapToCompanyResponse(company);
    }
    
    @Transactional
    public CompanyResponse updateCompany(UUID companyId, UpdateCompanyRequest request) {
        Company company = findCompanyById(companyId);
        User currentUser = userService.getCurrentUser();
        
        // Check ownership
        if (!company.getOwner().getId().equals(currentUser.getId()) && 
            currentUser.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You don't have permission to update this company");
        }
        
        if (request.getName() != null && !request.getName().isBlank()) {
            company.setName(request.getName());
        }
        if (request.getDescription() != null) {
            company.setDescription(request.getDescription());
        }
        if (request.getWebsite() != null) {
            company.setWebsite(request.getWebsite());
        }
        
        company = companyRepository.save(company);
        log.info("Company updated: {}", company.getName());
        
        return mapToCompanyResponse(company);
    }
    
    public Company findCompanyById(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));
    }
    
    private CompanyResponse mapToCompanyResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .website(company.getWebsite())
                .ownerId(company.getOwner().getId())
                .ownerName(company.getOwner().getName())
                .createdAt(company.getCreatedAt())
                .build();
    }
}

