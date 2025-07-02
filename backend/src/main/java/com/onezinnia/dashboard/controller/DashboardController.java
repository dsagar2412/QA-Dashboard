package com.onezinnia.dashboard.controller;

import com.onezinnia.dashboard.model.DashboardSnapshot;
import com.onezinnia.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<List<DashboardSnapshot>> getSummary() {
        return ResponseEntity.ok(dashboardService.getAllSnapshots());
    }

    // Automatically inserts a mock record on app start
    @PostConstruct
    public void seedMockData() {
        dashboardService.insertMockSnapshot();
    }
}
