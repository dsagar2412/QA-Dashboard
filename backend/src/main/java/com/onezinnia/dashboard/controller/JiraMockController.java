package com.onezinnia.dashboard.controller;
import com.onezinnia.dashboard.model.ApiResponse;
import com.onezinnia.dashboard.model.JiraIssue;
import com.onezinnia.dashboard.service.JiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/jira")
public class JiraMockController {

    private final JiraService jiraService;

    @Autowired
    public JiraMockController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    @GetMapping("/issues")
    public ApiResponse<List<JiraIssue>> getMockIssues() {
        List<JiraIssue> issues = jiraService.getAllMockIssues();

        return new ApiResponse<>(
                "success",
                "Jira issues retrieved successfully",
                issues
        );
    }
    @GetMapping("/summary")
    public ApiResponse<Map<String, Long>> getStatusSummary() {
        Map<String, Long> summary = jiraService.getStatusSummary();

        return new ApiResponse<>(
                "success",
                "Jira issue summary retrieved successfully",
                summary
        );
    }
}

