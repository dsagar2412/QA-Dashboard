package com.onezinnia.dashboard.controller;
import com.onezinnia.dashboard.model.ApiResponse;
import com.onezinnia.dashboard.model.TestCaseMongoModel;
import com.onezinnia.dashboard.service.TestCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/testcases")
public class TestCaseController {

    private final TestCaseService testCaseService;

    @Autowired
    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @GetMapping("/")
    public String healthCheck() {
        return "Backend is running!";
    }

    @GetMapping
    public ApiResponse<List<TestCaseMongoModel>> getTestCases(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String projectId) {
        List<TestCaseMongoModel> result;
        
        if (projectId != null && !projectId.isEmpty()) {
            try {
                int projectIdInt = Integer.parseInt(projectId);
                result = testCaseService.getTestCasesByProjectAndStatus(projectIdInt, status);
            } catch (NumberFormatException e) {
                result = List.of(); // Return empty list if projectId is not a valid integer
            }
        } else {
            result = (status != null && !status.isEmpty())
                    ? testCaseService.getTestCasesByStatus(status)
                    : testCaseService.getAllTestCases();
        }

        return new ApiResponse<>(
                "success",
                "Test cases retrieved successfully",
                result
        );
    }

    @GetMapping("/automated")
    public ApiResponse<List<TestCaseMongoModel>> getAutomatedTestCases() {
        List<TestCaseMongoModel> automatedTestCases = testCaseService.getAutomatedTestCases();
        
        return new ApiResponse<>(
                "success",
                "Automated test cases retrieved successfully",
                automatedTestCases
        );
    }

    @GetMapping("/manual")
    public ApiResponse<List<TestCaseMongoModel>> getManualTestCases() {
        List<TestCaseMongoModel> manualTestCases = testCaseService.getManualTestCases();
        
        return new ApiResponse<>(
                "success",
                "Manual test cases retrieved successfully",
                manualTestCases
        );
    }

    @GetMapping("/summary")
    public ApiResponse<Map<String, Long>> getTestCaseSummary(
            @RequestParam(required = false) String projectId) {
        Map<String, Long> summary;
        
        if (projectId != null && !projectId.isEmpty()) {
            try {
                int projectIdInt = Integer.parseInt(projectId);
                summary = testCaseService.getTestCaseSummaryByProject(projectIdInt);
            } catch (NumberFormatException e) {
                summary = Map.of(); // Return empty map if projectId is not a valid integer
            }
        } else {
            summary = testCaseService.getTestCaseSummary();
        }
        
        return new ApiResponse<>(
                "success",
                "Test case summary retrieved successfully",
                summary
        );
    }

    @GetMapping("/query")
    public ApiResponse<List<TestCaseMongoModel>> filterTestCases(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String automationType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<TestCaseMongoModel> filtered = testCaseService.filterTestCases(status, automationType, startDate, endDate);
        return new ApiResponse<>("success", "Filtered test cases retrieved", filtered);
    }
}