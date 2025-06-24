package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.JiraIssue;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Random;
@Service
public class JiraService {

    public List<JiraIssue> getAllMockIssues() {
        List<JiraIssue> issues = new ArrayList<>();
        String[] summaries = {
                "Fix login bug", "Improve UI", "Refactor API", "Update dependencies", "Add validations",
                "Fix logout crash", "Enable dark mode", "Fix broken links", "Optimize DB query", "Handle timeout errors"
        };
        String[] statuses = {"Open", "In Progress", "Resolved", "Closed"};
        String[] priorities = {"Low", "Medium", "High", "Critical"};

        Random random = new Random();

        for (int i = 1; i <= 50; i++) {
            String id = "JIRA-" + String.format("%03d", i);
            String summary = summaries[random.nextInt(summaries.length)];
            String status = statuses[random.nextInt(statuses.length)];
            String priority = priorities[random.nextInt(priorities.length)];
            issues.add(new JiraIssue(id, summary, status, priority));
        }

        return issues;
    }

    public Map<String, Long> getStatusSummary() {
        return getAllMockIssues().stream()
                .collect(Collectors.groupingBy(
                        JiraIssue::getStatus,
                        Collectors.counting()
                ));
    }
}
