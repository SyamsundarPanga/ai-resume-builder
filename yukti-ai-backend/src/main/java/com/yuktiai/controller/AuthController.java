package com.yuktiai.controller;

import com.yuktiai.dto.AuthRequest;
import com.yuktiai.dto.JwtResponse;
import com.yuktiai.dto.RefreshTokenRequest;
import com.yuktiai.dto.RegisterRequest;
import com.yuktiai.entity.User;
import com.yuktiai.repository.UserRepository;
import com.yuktiai.security.JwtUtils;
import com.yuktiai.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .name(userDetails.getName())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Error: Email is already in use!"));
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshJwtToken(@Valid @RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        if (refreshToken != null && jwtUtils.validateJwtToken(refreshToken)) {
            String username = jwtUtils.getUserNameFromJwtToken(refreshToken);
            String newAccessToken = jwtUtils.generateTokenFromUsername(username, 900000); // 15 mins
            String newRefreshToken = jwtUtils.generateTokenFromUsername(username, 604800000); // 7 days
            
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

            return ResponseEntity.ok(JwtResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .build());
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid refresh token"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.yuktiai.dto.ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.yuktiai.exception.ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String token = java.util.UUID.randomUUID().toString();
        String hashedToken = org.springframework.util.DigestUtils.md5DigestAsHex(token.getBytes());

        user.setResetToken(hashedToken);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "Password reset token generated successfully.",
            "token", token
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody com.yuktiai.dto.ResetPasswordRequest request) {
        String hashedToken = org.springframework.util.DigestUtils.md5DigestAsHex(request.getToken().getBytes());
        User user = userRepository.findByResetToken(hashedToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token."));

        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reset token has expired."));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully."));
    }
}
