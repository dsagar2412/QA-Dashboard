package com.onezinnia.dashboard.controller;

import com.onezinnia.dashboard.model.ApiResponse;
import com.onezinnia.dashboard.model.Milestone;
import com.onezinnia.dashboard.service.MilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;

    @Autowired
    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @GetMapping
    public ApiResponse<List<Milestone>> getMilestones(String sort) {
        List<Milestone> milestones = (sort != null && !sort.isEmpty())
                ? milestoneService.getSortedMilestones(sort)
                : milestoneService.getAllMilestones();

        return new ApiResponse<>(
                "success",
                "Milestones retrieved successfully",
                milestones
        );
    }
}
