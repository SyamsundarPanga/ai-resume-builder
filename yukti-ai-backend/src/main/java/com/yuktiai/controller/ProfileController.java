package com.yuktiai.controller;

import com.yuktiai.dto.ProfileRequest;
import com.yuktiai.entity.User;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @GetMapping
    public ResponseEntity<User> getProfile() {
        User user = getCurrentUser();
        // Hide password hash for security
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestBody ProfileRequest profileRequest) {
        User user = getCurrentUser();
        log.info("Updating profile for user: {}", user.getEmail());

        if (profileRequest.getName() != null) user.setName(profileRequest.getName());
        if (profileRequest.getPhone() != null) user.setPhone(profileRequest.getPhone());
        if (profileRequest.getLinkedin() != null) user.setLinkedin(profileRequest.getLinkedin());
        if (profileRequest.getGithub() != null) user.setGithub(profileRequest.getGithub());
        if (profileRequest.getPortfolio() != null) user.setPortfolio(profileRequest.getPortfolio());
        if (profileRequest.getLocation() != null) user.setLocation(profileRequest.getLocation());
        if (profileRequest.getTargetJobRole() != null) user.setTargetJobRole(profileRequest.getTargetJobRole());
        if (profileRequest.getYearsOfExperience() != null) user.setYearsOfExperience(profileRequest.getYearsOfExperience());

        User updatedUser = userRepository.save(user);
        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }
}
