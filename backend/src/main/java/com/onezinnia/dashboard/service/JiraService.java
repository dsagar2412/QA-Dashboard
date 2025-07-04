package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.JiraIssue;
import com.onezinnia.dashboard.model.DashboardSnapshot;
import com.onezinnia.dashboard.repository.DashboardSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Random;
@Service
public class JiraService {

    @Autowired
    private DashboardSnapshotRepository dashboardRepository;

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

    // Project-specific methods using DashboardSnapshot data
    public List<JiraIssue> getMockIssuesByProject(String projectId) {
        try {
            int projectIdInt = Integer.parseInt(projectId);
            List<DashboardSnapshot> snapshots = dashboardRepository.findByProjectId(projectIdInt);
            
            if (snapshots.isEmpty()) {
                return new ArrayList<>();
            }
            
            DashboardSnapshot snapshot = snapshots.get(0); // Get the first/latest snapshot
            return generateIssuesFromSnapshot(snapshot);
        } catch (NumberFormatException e) {
            return new ArrayList<>();
        }
    }

    private List<JiraIssue> generateIssuesFromSnapshot(DashboardSnapshot snapshot) {
        List<JiraIssue> issues = new ArrayList<>();
        Random random = new Random();
        
        String[] issueTypes = {
            "Bug", "Task", "Story", "Epic", "Improvement", "Sub-task"
        };
        
        String[] components = {
            "Authentication", "UI", "API", "Database", "Security", "Performance", 
            "Integration", "Reporting", "Configuration", "Workflow"
        };
        
        String[] statuses = {"Open", "In Progress", "Resolved", "Closed"};
        String[] priorities = {"Low", "Medium", "High", "Critical"};
        String[] assignees = {"John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson"};
        
        // Generate issues based on project health (more issues for projects with more failures)
        int totalIssues = Math.max(5, (snapshot.getFailed() + snapshot.getBlocked()) / 2);
        
        for (int i = 0; i < totalIssues; i++) {
            String id = snapshot.getProjectName().replaceAll("\\s+", "").toUpperCase() + "-" + (i + 1);
            String issueType = issueTypes[random.nextInt(issueTypes.length)];
            String component = components[random.nextInt(components.length)];
            String summary = issueType + ": " + component + " issue in " + snapshot.getProjectName();
            String status = statuses[random.nextInt(statuses.length)];
            String priority = priorities[random.nextInt(priorities.length)];
            String assignee = assignees[random.nextInt(assignees.length)];
            
            JiraIssue issue = new JiraIssue(id, summary, status, priority);
            issue.setAssignee(assignee);
            issue.setProjectId(String.valueOf(snapshot.getProjectId()));
            issue.setProjectName(snapshot.getProjectName());
            issues.add(issue);
        }
        
        return issues;
    }
}
