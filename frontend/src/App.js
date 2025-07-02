import React, { useEffect, useState } from 'react';
import { getTestCases, getTestCaseSummary, getJiraIssues } from './api/testcases';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import TestCasePieChart from './components/TestCasePieChart';
import DefectsChart from './components/DefectsChart';
import ProjectInfo from './components/ProjectInfo';
import TestCasesView from './components/TestCasesView';
import IssuesView from './components/IssuesView';
import CustomDashboard from './components/CustomDashboard';
import MasterDashboard from './components/MasterDashboard';
import './App.css';

function App() {
  const [testCases, setTestCases] = useState([]);
  const [summary, setSummary] = useState({});
  const [jiraIssues, setJiraIssues] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    getTestCases().then(setTestCases).catch(console.error);
    getTestCaseSummary().then(setSummary).catch(console.error);
    getJiraIssues()
      .then(data => {
        console.log("JIRA Issues received:", data);
        setJiraIssues(data);
      })
      .catch(error => {
        console.error("Error fetching JIRA issues:", error);
      });
  }, []);
  
  const handleNavItemClick = (itemId) => {
    setActiveNavItem(itemId);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const calculateSummary = () => {
    if (!testCases || !Array.isArray(testCases)) {
      return {
        total: 0,
        passed: 0,
        failed: 0,
        blocked: 0,
      };
    }
    
    const statusCounts = testCases.reduce((acc, testCase) => {
      const status = testCase.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: testCases.length,
      passed: statusCounts.passed || 0,
      failed: statusCounts.failed || 0,
      blocked: statusCounts.blocked || 0,
    };
  };

  const calculatedSummary = calculateSummary();

  return (
    <div className="app-container">
      {/* Top White Bar */}
      <div className="top-bar">
        <div className="logo-container">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
          <img
            src="/zinnia-logo.png"
            alt="Zinnia"
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }}
          />
          <span style={{ display: 'none', fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748' }}>
            Zinnia
          </span>
        </div>
      </div>

      <Sidebar
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        isCollapsed={sidebarCollapsed}
      />

      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="header">
          <h1>
            {activeNavItem === 'testcases' ? 'Test Cases Management' :
              activeNavItem === 'issues' ? 'Issues Management' :
              activeNavItem === 'custom-dashboard' ? 'Custom Dashboard' :
              activeNavItem === 'master-dashboard' ? 'Master Dashboard' :
              activeNavItem === 'projects' ? 'Projects Overview' :
                'Dashboard Overview'}
          </h1>
        </header>

        <div className="content-area">
          {activeNavItem === 'testcases' ? (
            <TestCasesView testCases={testCases} />
          ) : activeNavItem === 'issues' ? (
            <IssuesView jiraIssues={jiraIssues} />
          ) : activeNavItem === 'custom-dashboard' ? (
            <CustomDashboard 
              testCases={testCases} 
              jiraIssues={jiraIssues} 
              summary={calculatedSummary} 
            />
          ) : activeNavItem === 'master-dashboard' ? (
            <MasterDashboard />
          ) : activeNavItem === 'projects' ? (
            <MasterDashboard />
          ) : (
            <>
              <main className="dashboard-main">
                <DashboardCards summary={calculatedSummary} testCases={testCases} jiraIssues={jiraIssues} />
                <div className="charts-grid">
                  <TestCasePieChart testCases={testCases} />
                  <DefectsChart jiraIssues={jiraIssues} />
                </div>
                {testCases.length > 0 && (
                  <div className="chart-container" style={{ marginTop: '1rem' }}>
                    <div className="chart-header">
                      <h3 className="chart-title">Recent Test Cases</h3>
                      <div style={{ fontSize: '0.75rem', color: '#4a5568' }}>
                        Latest {Math.min(testCases.length, 8)} executions
                      </div>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {testCases.slice(0, 8).map(tc => (
                        <div key={tc.id} style={{
                          padding: '0.8rem',
                          borderBottom: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', marginBottom: '0.2rem', fontSize: '0.85rem' }}>
                              {tc.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#4a5568' }}>
                              {tc.executedAt} • {tc.automationType || 'Unknown'} Test
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              color: '#6b7280',
                              backgroundColor: tc.automationType?.toLowerCase() === 'automated' ? '#ede9fe' : '#eff6ff',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '12px',
                              border: `1px solid ${tc.automationType?.toLowerCase() === 'automated' ? '#8b5cf6' : '#3b82f6'}`
                            }}>
                              {tc.automationType === 'automated' ? '🤖' : '👤'} {tc.automationType || 'Manual'}
                            </span>
                            <span className={`status-${tc.status?.toLowerCase()}`} style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '500',
                              backgroundColor: tc.status?.toLowerCase() === 'passed' ? '#f0fff4' :
                                tc.status?.toLowerCase() === 'failed' ? '#fef5e7' : '#fffbeb',
                              border: `1px solid ${tc.status?.toLowerCase() === 'passed' ? '#22c55e' :
                                tc.status?.toLowerCase() === 'failed' ? '#ef4444' : '#f59e0b'}`
                            }}>
                              {tc.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </main>

              <ProjectInfo summary={calculatedSummary} testCases={testCases} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;