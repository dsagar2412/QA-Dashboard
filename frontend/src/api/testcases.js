// src/api/testcases.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export const getTestCases = () =>
  axios.get(`${API_BASE}/testcases`).then(res => res.data.data);

export const getTestCaseSummary = () =>
  axios.get(`${API_BASE}/testcases/summary`).then(res => res.data.data);

export const getJiraIssues = () =>
  axios.get(`${API_BASE}/jira/issues`)
    .then(res => {
      console.log("Raw JIRA API response:", res.data); // Debug log
      return res.data.data;
    });

export const getDashboardSummary = (projectId = null) => {
  const url = projectId ? `${API_BASE}/dashboard/summary?projectId=${projectId}` : `${API_BASE}/dashboard/summary`;
  return axios.get(url).then(res => res.data);
};

// Project-specific API functions
export const getProjectTestCases = (projectId) =>
  axios.get(`${API_BASE}/testcases?projectId=${projectId}`).then(res => res.data.data);

export const getProjectTestCaseSummary = (projectId) =>
  axios.get(`${API_BASE}/testcases/summary?projectId=${projectId}`).then(res => res.data.data);

export const getProjectJiraIssues = (projectId) =>
  axios.get(`${API_BASE}/jira/issues?projectId=${projectId}`)
    .then(res => {
      console.log(`Raw JIRA API response for project ${projectId}:`, res.data);
      return res.data.data;
    });

export const getProjectDashboardData = (projectId) => {
  return Promise.all([
    getProjectTestCases(projectId),
    getProjectTestCaseSummary(projectId),
    getProjectJiraIssues(projectId)
  ]).then(([testCases, summary, jiraIssues]) => ({
    testCases,
    summary,
    jiraIssues
  }));
};
