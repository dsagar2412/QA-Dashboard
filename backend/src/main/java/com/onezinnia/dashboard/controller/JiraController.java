package com.onezinnia.dashboard.controller;

import com.onezinnia.dashboard.model.ApiResponse;
import com.onezinnia.dashboard.model.JiraIssue;
import com.onezinnia.dashboard.service.JiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/jira")
public class JiraController {

    private final JiraService jiraService;

    @Autowired
    public JiraController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    @GetMapping("/issues")
    public ApiResponse<List<JiraIssue>> getIssues(
            @RequestParam(required = false) String projectId) {
        List<JiraIssue> issues = (projectId != null && !projectId.isEmpty())
                ? jiraService.getIssuesByProject(projectId)
                : jiraService.getAllIssues();

        return new ApiResponse<>(
                "success",
                "Jira issues retrieved successfully",
                issues
        );
    }

    @GetMapping("/summary")
    public ApiResponse<Map<String, Long>> getStatusSummary(
            @RequestParam(required = false) String projectId) {
        Map<String, Long> summary = (projectId != null && !projectId.isEmpty())
                ? jiraService.getStatusSummaryByProject(projectId)
                : jiraService.getStatusSummary();

        return new ApiResponse<>(
                "success",
                "Jira issue summary retrieved successfully",
                summary
        );
    }
} 