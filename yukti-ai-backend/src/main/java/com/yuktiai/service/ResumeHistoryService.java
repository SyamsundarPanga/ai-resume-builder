package com.yuktiai.service;

import com.yuktiai.entity.Resume;
import com.yuktiai.entity.ResumeVersion;

import java.util.List;

public interface ResumeHistoryService {
    ResumeVersion saveNewVersion(Resume resume, String cloudinaryUrl, String templateName, String optimizedJson);
    List<ResumeVersion> getVersions(Long resumeId);
    void restoreVersion(Long versionId) throws Exception;
    void deleteVersion(Long versionId);
}
