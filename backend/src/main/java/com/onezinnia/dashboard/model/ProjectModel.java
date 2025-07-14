package com.onezinnia.dashboard.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projects")
public class ProjectModel {

    @Id
    private String id;
    private String name;

    public ProjectModel() {
    }

    public ProjectModel(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
} 