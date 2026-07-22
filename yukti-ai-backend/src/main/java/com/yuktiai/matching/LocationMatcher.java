package com.yuktiai.matching;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class LocationMatcher {

    @lombok.Data
    public static class LocationMatchResult {
        private List<String> matchedLocations = new ArrayList<>();
        private List<String> missingLocations = new ArrayList<>();
        private boolean isWorkModeCompatible = true;
    }

    public LocationMatchResult matchLocation(String resumeLocation, List<String> jdLocations, String resumeWorkMode, String jdWorkMode) {
        LocationMatchResult result = new LocationMatchResult();
        if (jdLocations == null || jdLocations.isEmpty()) {
            return result;
        }

        String cleanResumeLoc = resumeLocation != null ? resumeLocation.toLowerCase().trim() : "";

        for (String loc : jdLocations) {
            String cleanLoc = loc.toLowerCase().trim();
            // Ignore work modes treated as locations
            if (cleanLoc.equals("remote") || cleanLoc.equals("hybrid") || cleanLoc.equals("onsite")) {
                continue;
            }

            if (cleanResumeLoc.contains(cleanLoc) || cleanLoc.contains(cleanResumeLoc) && !cleanResumeLoc.isEmpty()) {
                result.getMatchedLocations().add(loc);
            } else {
                result.getMissingLocations().add(loc);
            }
        }

        // Check work mode compatibility (e.g. Remote resume matches Remote/Hybrid JD)
        if (jdWorkMode != null && !jdWorkMode.isEmpty() && resumeWorkMode != null && !resumeWorkMode.isEmpty()) {
            String rm = resumeWorkMode.toLowerCase();
            String jm = jdWorkMode.toLowerCase();
            if (jm.contains("onsite") && rm.contains("remote") && !rm.contains("hybrid")) {
                result.setWorkModeCompatible(false);
            }
        }

        return result;
    }
}
