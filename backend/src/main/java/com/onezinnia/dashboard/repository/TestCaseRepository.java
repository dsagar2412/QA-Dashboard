package com.onezinnia.dashboard.repository;

import com.onezinnia.dashboard.model.TestCaseMongoModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends MongoRepository<TestCaseMongoModel, String> {

    List<TestCaseMongoModel> findByProjectId(int projectId);

    // Optional: add more queries if needed
    List<TestCaseMongoModel> findByStatus(String status);

    List<TestCaseMongoModel> findByAutomated(boolean automated);
}
