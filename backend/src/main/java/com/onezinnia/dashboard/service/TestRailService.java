package com.onezinnia.dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onezinnia.dashboard.model.ProjectModel;
import com.onezinnia.dashboard.model.TestCaseMongoModel;
import com.onezinnia.dashboard.repository.ProjectRepository;
import com.onezinnia.dashboard.repository.TestCaseRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class TestRailService {

    @Value("${testrail.base-url}")
    private String baseUrl;

    @Value("${testrail.username}")
    private String username;

    @Value("${testrail.token}")
    private String token;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<ProjectModel> getProjectList() {
        try {
            String url = baseUrl + "/index.php?/api/v2/get_projects";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String auth = username + ":" + token;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            HttpEntity<String> request = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            // Parse JSON response using Jackson ObjectMapper
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode projectsNode = rootNode.get("projects");

            List<ProjectModel> projectList = new ArrayList<>();
            
            if (projectsNode != null && projectsNode.isArray()) {
                for (JsonNode projectNode : projectsNode) {
                    ProjectModel project = new ProjectModel();
                    project.setId(String.valueOf(projectNode.get("id").asInt()));
                    project.setName(projectNode.get("name").asText());
                    
                    // Save to MongoDB
                    projectRepository.save(project);
                    projectList.add(project);
                }
            }

            return projectList;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<ProjectModel> getAllSavedProjects() {
        return projectRepository.findAll();
    }

    public void fetchAndSaveTestCases(int projectId) {
        try {
            String url = baseUrl + "/index.php?/api/v2/get_cases/" + projectId;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String auth = username + ":" + token;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            HttpEntity<String> request = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            JSONObject json = new JSONObject(response.getBody());
            JSONArray cases = json.getJSONArray("cases");

            for (int i = 0; i < cases.length(); i++) {
                JSONObject c = cases.getJSONObject(i);

                TestCaseMongoModel testCase = new TestCaseMongoModel();
                testCase.setId(String.valueOf(c.getInt("id")));
                testCase.setTitle(c.getString("title"));
                testCase.setType(String.valueOf(c.optInt("type_id", 0)));
                testCase.setAutomated(
                        c.optString("custom_automation_type", "").toLowerCase().contains("automated")
                );
                testCase.setProjectId(projectId);
                testCase.setCreatedBy(String.valueOf(c.optInt("created_by", -1)));
                testCase.setStatus("untested"); // default for now

                testCaseRepository.save(testCase);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
