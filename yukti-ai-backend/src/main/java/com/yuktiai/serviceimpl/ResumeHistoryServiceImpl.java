package com.yuktiai.serviceimpl;

import com.yuktiai.entity.ParsedResume;
import com.yuktiai.entity.Resume;
import com.yuktiai.entity.ResumeVersion;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.repository.ParsedResumeRepository;
import com.yuktiai.repository.ResumeRepository;
import com.yuktiai.repository.ResumeVersionRepository;
import com.yuktiai.service.ResumeHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeHistoryServiceImpl implements ResumeHistoryService {

    private final ResumeVersionRepository versionRepository;
    private final ResumeRepository resumeRepository;
    private final ParsedResumeRepository parsedResumeRepository;

    @Override
    @Transactional
    public ResumeVersion saveNewVersion(Resume resume, String cloudinaryUrl, String templateName, String optimizedJson) {
        log.info("Saving new version for Resume ID: {}", resume.getId());
        List<ResumeVersion> existing = versionRepository.findByResumeIdOrderByVersionNumberDesc(resume.getId());
        int nextVersion = existing.isEmpty() ? 1 : existing.get(0).getVersionNumber() + 1;

        ResumeVersion version = ResumeVersion.builder()
                .resume(resume)
                .versionNumber(nextVersion)
                .cloudinaryUrl(cloudinaryUrl)
                .templateName(templateName)
                .optimizedJson(optimizedJson)
                .build();

        return versionRepository.save(version);
    }

    @Override
    public List<ResumeVersion> getVersions(Long resumeId) {
        return versionRepository.findByResumeIdOrderByVersionNumberDesc(resumeId);
    }

    @Override
    @Transactional
    public void restoreVersion(Long versionId) throws Exception {
        log.info("Restoring Resume version ID: {}", versionId);
        ResumeVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found: " + versionId));

        Resume resume = version.getResume();
        resume.setCloudinaryUrl(version.getCloudinaryUrl());
        resumeRepository.save(resume);

        ParsedResume parsed = resume.getParsedResume();
        if (parsed != null) {
            parsed.setParsedJson(version.getOptimizedJson());
            parsedResumeRepository.save(parsed);
        } else {
            ParsedResume newParsed = ParsedResume.builder()
                    .resume(resume)
                    .parsedJson(version.getOptimizedJson())
                    .build();
            parsedResumeRepository.save(newParsed);
        }
    }

    @Override
    @Transactional
    public void deleteVersion(Long versionId) {
        log.info("Deleting resume version ID: {}", versionId);
        versionRepository.deleteById(versionId);
    }
}
