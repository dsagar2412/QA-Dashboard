package com.onezinnia.dashboard.repository;

import com.onezinnia.dashboard.model.ProjectModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<ProjectModel, String> {

    // Optional: add more queries if needed
    List<ProjectModel> findByName(String name);
} 