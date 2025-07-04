package com.onezinnia.dashboard.model;
import java.time.LocalDateTime;

public class TestCase {
    private String id;
    private String title;
    private String status;
    private LocalDateTime executedAt;
    private String automationType;
    private String projectId;
    private String projectName;
    //constructor
    public TestCase(String id, String title, String status, LocalDateTime executedAt,String automationType){
        this.id = id;
        this.title = title;
        this.status = status;
        this.executedAt = executedAt;
        this.automationType = automationType;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getStatus() { return status; }
    public LocalDateTime getExecutedAt() {return executedAt;}
    public String getAutomationType() {return  automationType;}
    public String getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }

    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setStatus(String status) { this.status = status; }
    public void setExecutedAt(LocalDateTime executedAt) {this.executedAt = executedAt; }
    public void setAutomationType(String automationType) { this.automationType = automationType;}
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
}