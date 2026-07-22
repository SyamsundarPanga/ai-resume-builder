package com.yuktiai.serviceimpl;

import com.yuktiai.entity.User;
import com.yuktiai.entity.UserActivityLog;
import com.yuktiai.repository.UserActivityLogRepository;
import com.yuktiai.service.UserActivityLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserActivityLogServiceImpl implements UserActivityLogService {

    private final UserActivityLogRepository logRepository;

    @Override
    @Transactional
    public void logActivity(User user, String action, String description, String ipAddress) {
        log.info("Auditing Activity: User: {}, Action: {}, Desc: {}", 
                user != null ? user.getEmail() : "ANONYMOUS", action, description);
        
        UserActivityLog activityLog = UserActivityLog.builder()
                .user(user)
                .action(action)
                .description(description)
                .ipAddress(ipAddress)
                .build();
        
        logRepository.save(activityLog);
    }
}
