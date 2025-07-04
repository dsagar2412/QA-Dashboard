package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.TestCase;
import com.onezinnia.dashboard.model.DashboardSnapshot;
import com.onezinnia.dashboard.repository.DashboardSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.Map;


@Service
public class TestCaseService {

    @Autowired
    private DashboardSnapshotRepository dashboardRepository;

    public List<TestCase> getAllTestCases() {
        List<TestCase> list = new ArrayList<>();
        String[] titles = {
                "Login check", "Signup flow", "Password reset", "Profile update", "Cart checkout",
                "Search feature", "Notification system", "Logout flow", "File upload", "Theme toggle"
        };
        String[] statuses = {"Passed", "Failed", "Blocked"};
        String[] automationTypes = { "Manual", "Automated" };
        String[] projectIds = { "PROJ-001", "PROJ-002", "PROJ-003", "PROJ-004", "PROJ-005" };
        Random random = new Random();
        //Random issue generation
        for (int i = 1; i <= 50; i++) {
            String id = "TC-" + String.format("%03d", i);
            String title = titles[random.nextInt(titles.length)];
            String status = statuses[random.nextInt(statuses.length)];
            LocalDateTime executedAt = LocalDateTime.now().minusDays(random.nextInt(10));
            String automationType = automationTypes[random.nextInt(2)];
            String projectId = projectIds[random.nextInt(projectIds.length)];
            TestCase testCase = new TestCase(id, title, status, executedAt, automationType);
            testCase.setProjectId(projectId);
            list.add(testCase);
        }
        return list;
    }
    public List<TestCase> getTestCasesByStatus(String status) {
        return getAllTestCases().stream()
                .filter(tc -> tc.getStatus().equalsIgnoreCase(status))
                .toList();
    }
    public Map<String, Long> getTestCaseSummary() {
        return getAllTestCases().stream()
                .collect(Collectors.groupingBy(
                        TestCase::getStatus,
                        Collectors.counting()
                ));
    }
    public List<TestCase> filterTestCases(String status, String type, LocalDate startDate, LocalDate endDate) {
        return getAllTestCases().stream()
                .filter(tc -> status == null || tc.getStatus().equalsIgnoreCase(status))
                .filter(tc -> type == null || tc.getAutomationType().equalsIgnoreCase(type))
                .filter(tc -> {
                    if (startDate == null && endDate == null) return true;
                    LocalDate executedDate = tc.getExecutedAt().toLocalDate();
                    if (startDate != null && executedDate.isBefore(startDate)) return false;
                    return endDate == null || !executedDate.isAfter(endDate);
                })
                .collect(Collectors.toList());
    }

    // Project-specific methods using DashboardSnapshot data
    public List<TestCase> getTestCasesByProject(String projectId, String status) {
        try {
            int projectIdInt = Integer.parseInt(projectId);
            List<DashboardSnapshot> snapshots = dashboardRepository.findByProjectId(projectIdInt);
            
            if (snapshots.isEmpty()) {
                return new ArrayList<>();
            }
            
            DashboardSnapshot snapshot = snapshots.get(0); // Get the first/latest snapshot
            
            List<TestCase> projectTestCases = generateTestCasesFromSnapshot(snapshot);
            
            if (status != null && !status.isEmpty()) {
                return projectTestCases.stream()
                        .filter(tc -> tc.getStatus().equalsIgnoreCase(status))
                        .collect(Collectors.toList());
            }
            
            return projectTestCases;
        } catch (NumberFormatException e) {
            return new ArrayList<>();
        }
    }

    public Map<String, Long> getTestCaseSummaryByProject(String projectId) {
        try {
            int projectIdInt = Integer.parseInt(projectId);
            List<DashboardSnapshot> snapshots = dashboardRepository.findByProjectId(projectIdInt);
            
            if (snapshots.isEmpty()) {
                return Map.of();
            }
            
            DashboardSnapshot snapshot = snapshots.get(0); // Get the first/latest snapshot
            
            return Map.of(
                "Passed", (long) snapshot.getPassed(),
                "Failed", (long) snapshot.getFailed(),
                "Blocked", (long) snapshot.getBlocked()
            );
        } catch (NumberFormatException e) {
            return Map.of();
        }
    }

    private List<TestCase> generateTestCasesFromSnapshot(DashboardSnapshot snapshot) {
        List<TestCase> testCases = new ArrayList<>();
        Random random = new Random();
        
        String[] testCategories = {
            "Authentication", "User Management", "Data Processing", "API Integration", 
            "UI Components", "Database Operations", "Security", "Performance", 
            "Reporting", "Configuration", "Workflow", "Notifications"
        };
        
        String[] testActions = {
            "Login", "Signup", "Update", "Delete", "Create", "View", "Search", 
            "Filter", "Export", "Import", "Validate", "Process", "Submit", "Reset"
        };
        
        // Generate passed test cases
        for (int i = 0; i < snapshot.getPassed(); i++) {
            String id = "TC-" + snapshot.getProjectId() + "-" + String.format("%03d", i + 1);
            String category = testCategories[random.nextInt(testCategories.length)];
            String action = testActions[random.nextInt(testActions.length)];
            String title = category + " - " + action + " Test";
            
            LocalDateTime executedAt = snapshot.getUpdatedAt().minusDays(random.nextInt(7));
            String automationType = (i < snapshot.getAutomatedCount()) ? "Automated" : "Manual";
            
            TestCase testCase = new TestCase(id, title, "Passed", executedAt, automationType);
            testCase.setProjectId(String.valueOf(snapshot.getProjectId()));
            testCase.setProjectName(snapshot.getProjectName());
            testCases.add(testCase);
        }
        
        // Generate failed test cases
        for (int i = 0; i < snapshot.getFailed(); i++) {
            String id = "TC-" + snapshot.getProjectId() + "-" + String.format("%03d", snapshot.getPassed() + i + 1);
            String category = testCategories[random.nextInt(testCategories.length)];
            String action = testActions[random.nextInt(testActions.length)];
            String title = category + " - " + action + " Test";
            
            LocalDateTime executedAt = snapshot.getUpdatedAt().minusDays(random.nextInt(7));
            String automationType = ((snapshot.getPassed() + i) < snapshot.getAutomatedCount()) ? "Automated" : "Manual";
            
            TestCase testCase = new TestCase(id, title, "Failed", executedAt, automationType);
            testCase.setProjectId(String.valueOf(snapshot.getProjectId()));
            testCase.setProjectName(snapshot.getProjectName());
            testCases.add(testCase);
        }
        
        // Generate blocked test cases
        for (int i = 0; i < snapshot.getBlocked(); i++) {
            String id = "TC-" + snapshot.getProjectId() + "-" + String.format("%03d", snapshot.getPassed() + snapshot.getFailed() + i + 1);
            String category = testCategories[random.nextInt(testCategories.length)];
            String action = testActions[random.nextInt(testActions.length)];
            String title = category + " - " + action + " Test";
            
            LocalDateTime executedAt = snapshot.getUpdatedAt().minusDays(random.nextInt(7));
            String automationType = ((snapshot.getPassed() + snapshot.getFailed() + i) < snapshot.getAutomatedCount()) ? "Automated" : "Manual";
            
            TestCase testCase = new TestCase(id, title, "Blocked", executedAt, automationType);
            testCase.setProjectId(String.valueOf(snapshot.getProjectId()));
            testCase.setProjectName(snapshot.getProjectName());
            testCases.add(testCase);
        }
        
        return testCases;
    }

}