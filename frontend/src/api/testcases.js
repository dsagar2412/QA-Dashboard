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
