package com.onezinnia.dashboard.model;

import java.time.LocalDate;

public class Milestone {
    private String name;
    private LocalDate targetDate;
    private String status;

    public Milestone(String name, LocalDate targetDate, String status) {
        this.name = name;
        this.targetDate = targetDate;
        this.status = status;
    }

    public String getName() { return name; }
    public LocalDate getTargetDate() { return targetDate; }
    public String getStatus() { return status; }

    public void setName(String name) { this.name = name; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    public void setStatus(String status) { this.status = status; }
}
