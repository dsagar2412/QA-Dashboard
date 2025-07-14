package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.JiraIssue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class JiraService {

    @Value("${jira.base-url:}")
    private String baseUrl;

    @Value("${jira.username:}")
    private String username;

    @Value("${jira.token:}")
    private String token;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<JiraIssue> getAllIssues() {
        // TODO: Implement real Jira API integration
        // This method should fetch issues from Jira API
        // For now, return empty list until Jira API credentials are configured
        return new ArrayList<>();
    }

    public List<JiraIssue> getIssuesByProject(String projectId) {
        // TODO: Implement real Jira API integration for project-specific issues
        // This method should fetch issues for a specific project from Jira API
        return new ArrayList<>();
    }

    public Map<String, Long> getStatusSummary() {
        return getAllIssues().stream()
                .collect(Collectors.groupingBy(
                        JiraIssue::getStatus,
                        Collectors.counting()
                ));
    }

    public Map<String, Long> getStatusSummaryByProject(String projectId) {
        return getIssuesByProject(projectId).stream()
                .collect(Collectors.groupingBy(
                        JiraIssue::getStatus,
                        Collectors.counting()
                ));
    }

    // Helper method to create HTTP headers for Jira API authentication
    private HttpHeaders createJiraHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        if (username != null && !username.isEmpty() && token != null && !token.isEmpty()) {
            String auth = username + ":" + token;
            String encodedAuth = java.util.Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);
        }
        
        return headers;
    }
}
