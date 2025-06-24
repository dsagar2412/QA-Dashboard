package com.onezinnia.dashboard.controller;
import com.onezinnia.dashboard.model.ApiResponse;
import com.onezinnia.dashboard.model.TestCase;
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
    public ApiResponse<List<TestCase>> getTestCases(String status) {
        List<TestCase> result = (status != null && !status.isEmpty())
                ? testCaseService.getTestCasesByStatus(status)
                : testCaseService.getAllTestCases();

        return new ApiResponse<>(
                "success",
                "Test cases retrieved successfully",
                result
        );
    }

    @GetMapping("/sorted")
    public ApiResponse<List<TestCase>> getSortedTestCases(@RequestParam(defaultValue = "asc") String order) {
        List<TestCase> all = testCaseService.getAllTestCases();

        all.sort((a, b) -> {
            if ("desc".equalsIgnoreCase(order)) {
                return b.getExecutedAt().compareTo(a.getExecutedAt());
            } else {
                return a.getExecutedAt().compareTo(b.getExecutedAt());
            }
        });

        return new ApiResponse<>(
                "success",
                "Test cases sorted by execution time",
                all
        );
    }


    @GetMapping("/summary")
    public ApiResponse<Map<String, Long>> getTestCaseSummary() {
        Map<String, Long> summary = testCaseService.getTestCaseSummary();
        return new ApiResponse<>(
                "success",
                "Test case summary retrieved successfully",
                summary
        );
    }

    @GetMapping("/query")
    public ApiResponse<List<TestCase>> filterTestCases(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String automationType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<TestCase> filtered = testCaseService.filterTestCases(status, automationType, startDate, endDate);
        return new ApiResponse<>("success", "Filtered test cases retrieved", filtered);
    }



}
