package com.onezinnia.dashboard.repository;

import com.onezinnia.dashboard.model.DashboardSnapshot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardSnapshotRepository extends MongoRepository<DashboardSnapshot, String> {

    // Optional: find all by project ID
    List<DashboardSnapshot> findByProjectId(int projectId);

    // Optional: find all snapshots for a sprint
    List<DashboardSnapshot> findBySprint(String sprint);
}