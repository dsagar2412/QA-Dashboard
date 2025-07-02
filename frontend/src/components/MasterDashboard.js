import React, { useState, useEffect, useMemo } from 'react';
import { getDashboardSummary, getTestCases, getJiraIssues } from '../api/testcases';
import TestCasePieChart from './TestCasePieChart';
import DefectsChart from './DefectsChart';
import DashboardCards from './DashboardCards';
import './MasterDashboard.css';

const MasterDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');

  // Load all project summaries
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const summaries = await getDashboardSummary();
        setProjects(summaries);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Error fetching dashboard summaries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Generate mock test cases based on project snapshot data
  const generateMockTestCases = (project) => {
    const testCases = [];
    let id = 1;
    
    const testCaseTypes = [
      'Login Functionality',
      'User Registration',
      'API Integration',
      'Database Operations',
      'UI Component Rendering',
      'Payment Processing',
      'Search Functionality',
      'Data Validation',
      'Security Tests',
      'Performance Tests'
    ];

    // Generate passed test cases
    for (let i = 0; i < project.passed; i++) {
      const isAutomated = i < project.automatedCount;
      const testType = testCaseTypes[i % testCaseTypes.length];
      testCases.push({
        id: `${project.projectId}-${id++}`,
        title: `${testType} - ${project.projectName}`,
        status: 'Passed',
        automationType: isAutomated ? 'automated' : 'manual',
        executedAt: new Date(new Date().getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        project: project.projectName,
        sprint: project.sprint
      });
    }

    // Generate failed test cases
    for (let i = 0; i < project.failed; i++) {
      const isAutomated = (project.passed + i) < project.automatedCount;
      const testType = testCaseTypes[(project.passed + i) % testCaseTypes.length];
      testCases.push({
        id: `${project.projectId}-${id++}`,
        title: `${testType} - ${project.projectName}`,
        status: 'Failed',
        automationType: isAutomated ? 'automated' : 'manual',
        executedAt: new Date(new Date().getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        project: project.projectName,
        sprint: project.sprint
      });
    }

    // Generate blocked test cases
    for (let i = 0; i < project.blocked; i++) {
      const isAutomated = (project.passed + project.failed + i) < project.automatedCount;
      const testType = testCaseTypes[(project.passed + project.failed + i) % testCaseTypes.length];
      testCases.push({
        id: `${project.projectId}-${id++}`,
        title: `${testType} - ${project.projectName}`,
        status: 'Blocked',
        automationType: isAutomated ? 'automated' : 'manual',
        executedAt: new Date(new Date().getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        project: project.projectName,
        sprint: project.sprint
      });
    }

    return testCases;
  };

  // Generate mock JIRA issues based on project data
  const generateMockJiraIssues = (project) => {
    const issues = [];
    const issueCount = Math.max(1, Math.floor(project.failed * 0.7)); // Assume 70% of failures have associated issues

    for (let i = 0; i < issueCount; i++) {
      issues.push({
        id: `${project.projectName.toUpperCase()}-${100 + i}`,
        key: `${project.projectName.toUpperCase()}-${100 + i}`,
        summary: `Issue in ${project.projectName} - Sprint ${project.sprint}`,
        status: Math.random() > 0.5 ? 'Open' : 'In Progress',
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        assignee: `Developer ${i + 1}`,
        created: new Date(new Date().getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        project: project.projectName
      });
    }

    return issues;
  };

  // Load detailed project data when a project is selected
  useEffect(() => {
    if (selectedProject) {
      try {
        setLoading(true);
        const project = projects.find(p => p.projectId === selectedProject);
        
        if (project) {
          // Generate mock data based on project snapshot
          const mockTestCases = generateMockTestCases(project);
          const mockJiraIssues = generateMockJiraIssues(project);
          
          setProjectDetails({
            testCases: mockTestCases,
            jiraIssues: mockJiraIssues,
            project: project
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load project details');
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedProject, projects]);

  // Calculate health score based on pass rate
  const getHealthScore = (passed, total) => {
    if (total === 0) return { score: 0, status: 'unknown', color: '#6b7280' };
    const passRate = (passed / total) * 100;
    
    if (passRate >= 80) return { score: passRate, status: 'healthy', color: '#22c55e' };
    if (passRate >= 60) return { score: passRate, status: 'warning', color: '#f59e0b' };
    return { score: passRate, status: 'critical', color: '#ef4444' };
  };

  // Calculate automation percentage
  const getAutomationPercentage = (automatedCount, total) => {
    return total > 0 ? Math.round((automatedCount / total) * 100) : 0;
  };

  // Filter projects based on search query and health filter
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery === '' ||
        project.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.sprint?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (healthFilter === 'all') return true;

      const health = getHealthScore(project.passed, project.total);
      return health.status === healthFilter;
    });
  }, [projects, searchQuery, healthFilter]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  // Handle project card click
  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
  };

  // Handle back to master dashboard
  const handleBackClick = () => {
    setSelectedProject(null);
    setProjectDetails(null);
  };

  if (loading && !selectedProject) {
    return (
      <div className="master-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error && !selectedProject) {
    return (
      <div className="master-dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Detailed project view
  if (selectedProject && projectDetails) {
    const { testCases, jiraIssues, project } = projectDetails;
    
    // Use project snapshot data directly instead of calculating from mock test cases
    const projectSummary = {
      total: project.total,
      passed: project.passed,
      failed: project.failed,
      blocked: project.blocked,
      automated: project.automatedCount,
      manual: project.manualCount
    };

    return (
      <div className="master-dashboard">
        <div className="dashboard-header">
          <div>
            <h2>{project?.projectName || 'Project'} - Detailed Dashboard</h2>
            <p className="project-subtitle">{project?.sprint} • Updated {formatDate(project?.updatedAt)}</p>
          </div>
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Master Dashboard
          </button>
        </div>

        <div className="dashboard-main">
          <DashboardCards 
            summary={projectSummary} 
            testCases={testCases} 
            jiraIssues={jiraIssues} 
          />
          
          <div className="charts-grid">
            <TestCasePieChart testCases={testCases} />
            <DefectsChart jiraIssues={jiraIssues} />
          </div>

          {testCases.length > 0 && (
            <div className="chart-container">
              <div className="chart-header">
                <h3 className="chart-title">Recent Test Cases</h3>
                <div className="chart-subtitle">
                  Latest {Math.min(testCases.length, 8)} executions
                </div>
              </div>
              <div className="recent-test-cases">
                {testCases.slice(0, 8).map(tc => (
                  <div key={tc.id} className="test-case-item">
                    <div className="test-case-content">
                      <div className="test-case-title">{tc.title}</div>
                      <div className="test-case-meta">
                        {tc.executedAt} • {tc.automationType || 'Unknown'} Test
                      </div>
                    </div>
                    <div className="test-case-badges">
                      <span className={`automation-badge ${tc.automationType?.toLowerCase() === 'automated' ? 'automated' : 'manual'}`}>
                        {tc.automationType === 'automated' ? '🤖' : '👤'} {tc.automationType || 'Manual'}
                      </span>
                      <span className={`status-badge status-${tc.status?.toLowerCase()}`}>
                        {tc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Master Dashboard view
  return (
    <div className="master-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Master Dashboard</h2>
          <p className="dashboard-subtitle">Project overview and health monitoring</p>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Filters and Search */}
        <div className="dashboard-filters">
          <div className="search-section">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search projects or sprints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="health-filters">
            <label className="filter-label">Health Filter:</label>
            <div className="health-filter-buttons">
              <button
                className={`health-filter-btn ${healthFilter === 'all' ? 'active' : ''}`}
                onClick={() => setHealthFilter('all')}
              >
                All Projects
              </button>
              <button
                className={`health-filter-btn healthy ${healthFilter === 'healthy' ? 'active' : ''}`}
                onClick={() => setHealthFilter('healthy')}
              >
                🟢 Healthy
              </button>
              <button
                className={`health-filter-btn warning ${healthFilter === 'warning' ? 'active' : ''}`}
                onClick={() => setHealthFilter('warning')}
              >
                🟡 Warning
              </button>
              <button
                className={`health-filter-btn critical ${healthFilter === 'critical' ? 'active' : ''}`}
                onClick={() => setHealthFilter('critical')}
              >
                🔴 Critical
              </button>
            </div>
          </div>
        </div>

        {/* Health Legend */}
        <div className="health-legend">
          <h4>Health Indicators</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot healthy"></span>
              <span>Healthy (≥80% pass rate)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot warning"></span>
              <span>Warning (60-79% pass rate)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot critical"></span>
              <span>Critical (&lt;60% pass rate)</span>
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="no-projects">
              <div className="no-projects-icon">📊</div>
              <h3>No Projects Found</h3>
              <p>No projects match your current filters.</p>
            </div>
          ) : (
            filteredProjects.map(project => {
              const health = getHealthScore(project.passed, project.total);
              const automationPercent = getAutomationPercentage(project.automatedCount, project.total);

              return (
                <div
                  key={project.projectId}
                  className="project-card"
                  onClick={() => handleProjectClick(project.projectId)}
                >
                  <div className="project-card-header">
                    <div className="project-title">
                      <h3>{project.projectName}</h3>
                      <div className="project-sprint">{project.sprint}</div>
                    </div>
                    <div className={`health-indicator ${health.status}`}>
                      <span className="health-dot"></span>
                      <span className="health-score">{Math.round(health.score)}%</span>
                    </div>
                  </div>

                  <div className="project-stats">
                    <div className="stat-row">
                      <span className="stat-label">Total Test Cases</span>
                      <span className="stat-value">{project.total}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Passed</span>
                      <span className="stat-value passed">{project.passed}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Failed</span>
                      <span className="stat-value failed">{project.failed}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Blocked</span>
                      <span className="stat-value blocked">{project.blocked}</span>
                    </div>
                  </div>

                  <div className="project-metrics">
                    <div className="metric">
                      <div className="metric-label">Automation</div>
                      <div className="metric-value">{automationPercent}%</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Pass Rate</div>
                      <div className="metric-value" style={{ color: health.color }}>
                        {Math.round(health.score)}%
                      </div>
                    </div>
                  </div>

                  <div className="project-footer">
                    <div className="last-updated">
                      Last updated: {formatDate(project.updatedAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterDashboard;
