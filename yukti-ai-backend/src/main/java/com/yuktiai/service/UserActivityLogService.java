package com.yuktiai.service;

import com.yuktiai.entity.User;

public interface UserActivityLogService {
    void logActivity(User user, String action, String description, String ipAddress);
}
