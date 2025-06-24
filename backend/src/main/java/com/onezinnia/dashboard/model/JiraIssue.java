package com.onezinnia.dashboard.model;
//script for accepting input and assigning them.
public class JiraIssue {
    private String id;
    private String summary;
    private String status;
    private String priority;

    public JiraIssue(String id, String summary, String status, String priority) {
        this.id = id;
        this.summary = summary;
        this.status = status;
        this.priority = priority;
    }

    public String getId() {
        return id;
    }

    public String getSummary() {
        return summary;
    }

    public String getStatus() {
        return status;
    }

    public String getPriority() {
        return priority;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
