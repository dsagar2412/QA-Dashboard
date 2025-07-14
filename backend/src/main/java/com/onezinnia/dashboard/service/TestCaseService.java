package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.TestCaseMongoModel;
import com.onezinnia.dashboard.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TestCaseService {

    @Autowired
    private TestCaseRepository testCaseRepository;

    public List<TestCaseMongoModel> getAllTestCases() {
        return testCaseRepository.findAll();
    }

    public List<TestCaseMongoModel> getTestCasesByStatus(String status) {
        return testCaseRepository.findByStatus(status);
    }

    public List<TestCaseMongoModel> getTestCasesByProject(int projectId) {
        return testCaseRepository.findByProjectId(projectId);
    }

    public List<TestCaseMongoModel> getTestCasesByProjectAndStatus(int projectId, String status) {
        List<TestCaseMongoModel> projectTestCases = testCaseRepository.findByProjectId(projectId);
        
        if (status != null && !status.isEmpty()) {
            return projectTestCases.stream()
                    .filter(tc -> tc.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }
        
        return projectTestCases;
    }

    public Map<String, Long> getTestCaseSummary() {
        return getAllTestCases().stream()
                .collect(Collectors.groupingBy(
                        TestCaseMongoModel::getStatus,
                        Collectors.counting()
                ));
    }

    public Map<String, Long> getTestCaseSummaryByProject(int projectId) {
        return getTestCasesByProject(projectId).stream()
                .collect(Collectors.groupingBy(
                        TestCaseMongoModel::getStatus,
                        Collectors.counting()
                ));
    }

    public List<TestCaseMongoModel> filterTestCases(String status, String automationType, LocalDate startDate, LocalDate endDate) {
        List<TestCaseMongoModel> allTestCases = getAllTestCases();
        
        return allTestCases.stream()
                .filter(tc -> status == null || tc.getStatus().equalsIgnoreCase(status))
                .filter(tc -> automationType == null || 
                        (automationType.equalsIgnoreCase("Automated") && tc.isAutomated()) ||
                        (automationType.equalsIgnoreCase("Manual") && !tc.isAutomated()))
                .collect(Collectors.toList());
    }

    public List<TestCaseMongoModel> getAutomatedTestCases() {
        return testCaseRepository.findByAutomated(true);
    }

    public List<TestCaseMongoModel> getManualTestCases() {
        return testCaseRepository.findByAutomated(false);
    }
}