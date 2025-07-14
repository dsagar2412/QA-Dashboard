package com.onezinnia.dashboard.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "testCases")
public class TestCaseMongoModel {

    @Id
    private String id;

    private String title;
    private String type;
    private String status;
    private boolean automated;
    private int projectId;
    private String createdBy;
    private String sectionName; // Optional - if grouping by sections

    public TestCaseMongoModel() {
    }

    public TestCaseMongoModel(String id, String title, String type, String status,
                              boolean automated, int projectId, String createdBy, String sectionName) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.status = status;
        this.automated = automated;
        this.projectId = projectId;
        this.createdBy = createdBy;
        this.sectionName = sectionName;
    }

    // Getters & Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isAutomated() { return automated; }
    public void setAutomated(boolean automated) { this.automated = automated; }

    public int getProjectId() { return projectId; }
    public void setProjectId(int projectId) { this.projectId = projectId; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
}
