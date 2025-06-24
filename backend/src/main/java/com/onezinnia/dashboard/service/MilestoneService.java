package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.Milestone;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MilestoneService {

    public List<Milestone> getAllMilestones() {
        return List.of(
                new Milestone("Phase 1 Complete", LocalDate.of(2025, 6, 15), "Completed"),
                new Milestone("UAT Start", LocalDate.of(2025, 6, 22), "Upcoming"),
                new Milestone("Final Release", LocalDate.of(2025, 7, 5), "Planned")
        );
    }
    public List<Milestone> getSortedMilestones(String order) {
        List<Milestone> milestones = getAllMilestones();

        return milestones.stream()
                .sorted((m1, m2) -> {
                    if ("desc".equalsIgnoreCase(order)) {
                        return m2.getTargetDate().compareTo(m1.getTargetDate());
                    } else {
                        return m1.getTargetDate().compareTo(m2.getTargetDate());
                    }
                })
                .toList();
    }
}