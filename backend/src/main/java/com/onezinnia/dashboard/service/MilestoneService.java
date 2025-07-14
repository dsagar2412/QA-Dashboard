package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.Milestone;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Service
public class MilestoneService {

    public List<Milestone> getAllMilestones() {
        // TODO: Implement real milestone data integration
        // This could be from a project management API, database, or configuration
        // For now, return empty list until real data source is configured
        return new ArrayList<>();
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

    public List<Milestone> getMilestonesByStatus(String status) {
        return getAllMilestones().stream()
                .filter(m -> m.getStatus().equalsIgnoreCase(status))
                .toList();
    }

    public List<Milestone> getUpcomingMilestones() {
        LocalDate today = LocalDate.now();
        return getAllMilestones().stream()
                .filter(m -> m.getTargetDate().isAfter(today))
                .sorted((m1, m2) -> m1.getTargetDate().compareTo(m2.getTargetDate()))
                .toList();
    }
}