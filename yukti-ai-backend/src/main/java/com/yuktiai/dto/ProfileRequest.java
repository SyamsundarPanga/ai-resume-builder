package com.yuktiai.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProfileRequest {
    private String name;
    private String email;
    private String phone;
    private String linkedin;
    private String github;
    private String portfolio;
    private String location;
    private String targetJobRole;
    private BigDecimal yearsOfExperience;
}
