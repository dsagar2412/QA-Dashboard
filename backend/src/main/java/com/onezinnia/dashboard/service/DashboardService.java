package com.onezinnia.dashboard.service;

import com.onezinnia.dashboard.model.DashboardSnapshot;
import com.onezinnia.dashboard.repository.DashboardSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class DashboardService {

    @Autowired
    private DashboardSnapshotRepository repository;

    public List<DashboardSnapshot> getAllSnapshots() {
        return repository.findAll();
    }

    public void insertMockSnapshot() {
        // Only seed data if the database is empty
        if (repository.count() > 0) {
            System.out.println("Dashboard snapshots already exist, skipping seed data.");
            return;
        }

        String[] projectNames = {
                "Zinnia Core", "Zinnia Claims", "Farmer Portal", "Internal Tools", "Client Alpha",
                "Client Beta", "Zinnia Insights", "Performance Suite", "Test Manager", "Client Omega"
        };

        Random random = new Random();

        for (int i = 0; i < projectNames.length; i++) {
            int total = 80 + random.nextInt(40); // 80–120 test cases
            int passed = random.nextInt(total);
            int failed = random.nextInt(total - passed);
            int blocked = total - passed - failed;

            int automated = (int) (total * (0.4 + Math.random() * 0.4)); // 40–80% automated
            int manual = total - automated;

            DashboardSnapshot snapshot = new DashboardSnapshot(
                    null,
                    100 + i,                          // projectId
                    projectNames[i],                  // projectName
                    "Sprint 28",                      // sprint
                    total,
                    passed,
                    failed,
                    blocked,
                    LocalDateTime.now(),              // updatedAt
                    automated,
                    manual
            );

            repository.save(snapshot);
        }
        
        System.out.println("Seeded " + projectNames.length + " dashboard snapshots.");
    }
}
