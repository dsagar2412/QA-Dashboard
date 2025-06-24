package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.TestCase;
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

    public List<TestCase> getAllTestCases() {
        List<TestCase> list = new ArrayList<>();
        String[] titles = {
                "Login check", "Signup flow", "Password reset", "Profile update", "Cart checkout",
                "Search feature", "Notification system", "Logout flow", "File upload", "Theme toggle"
        };
        String[] statuses = {"Passed", "Failed", "Blocked"};
        String[] automationTypes = { "Manual", "Automated" };
        Random random = new Random();
        //Random issue generation
        for (int i = 1; i <= 50; i++) {
            String id = "TC-" + String.format("%03d", i);
            String title = titles[random.nextInt(titles.length)];
            String status = statuses[random.nextInt(statuses.length)];
            LocalDateTime executedAt = LocalDateTime.now().minusDays(random.nextInt(10));
            String automationType = automationTypes[random.nextInt(2)];
            list.add(new TestCase(id, title, status,executedAt,automationType));
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

}