package com.onezinnia.dashboard.controller;

import com.onezinnia.dashboard.model.ProjectModel;
import com.onezinnia.dashboard.service.TestRailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testrail")
public class TestRailController {

    @Autowired
    private TestRailService testRailService;

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectModel>> getProjects() {
        List<ProjectModel> projects = testRailService.getAllSavedProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/sync/projects")
    public ResponseEntity<List<ProjectModel>> syncProjects() {
        List<ProjectModel> projects = testRailService.getProjectList();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/sync/testcases/{projectId}")
    public ResponseEntity<String> syncTestCases(@PathVariable int projectId) {
        testRailService.fetchAndSaveTestCases(projectId);
        return ResponseEntity.ok("Test cases synced successfully.");
    }
}
