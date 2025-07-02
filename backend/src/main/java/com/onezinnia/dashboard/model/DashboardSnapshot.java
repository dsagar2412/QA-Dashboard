package com.onezinnia.dashboard.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "dashboard_snapshots")
public class DashboardSnapshot {

    @Id
    private String id;

    private int projectId;
    private String projectName;
    private String sprint;
    private int total;
    private int passed;
    private int failed;
    private int blocked;
    private int automatedCount;
    private int manualCount;
    private LocalDateTime updatedAt;

    // No-arg constructor (required by MongoDB)
    public DashboardSnapshot() {
    }

    // All-args constructor
    public DashboardSnapshot(String id, int projectId, String projectName, String sprint,
                             int total, int passed, int failed, int blocked,
                             LocalDateTime updatedAt, int automatedCount, int manualCount) {
        this.id = id;
        this.projectId = projectId;
        this.projectName = projectName;
        this.sprint = sprint;
        this.total = total;
        this.passed = passed;
        this.failed = failed;
        this.blocked = blocked;
        this.updatedAt = updatedAt;
        this.automatedCount = automatedCount;
        this.manualCount = manualCount;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getSprint() {
        return sprint;
    }

    public void setSprint(String sprint) {
        this.sprint = sprint;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getPassed() {
        return passed;
    }

    public void setPassed(int passed) {
        this.passed = passed;
    }

    public int getFailed() {
        return failed;
    }

    public void setFailed(int failed) {
        this.failed = failed;
    }

    public int getBlocked() {
        return blocked;
    }

    public void setBlocked(int blocked) {
        this.blocked = blocked;
    }

    public int getAutomatedCount() {
        return automatedCount;
    }

    public void setAutomatedCount(int automatedCount) {
        this.automatedCount = automatedCount;
    }

    public int getManualCount() {
        return manualCount;
    }

    public void setManualCount(int manualCount) {
        this.manualCount = manualCount;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
