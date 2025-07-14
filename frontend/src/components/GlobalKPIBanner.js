import React from 'react';
import AnimatedNumber from './AnimatedNumber';
import HealthDistributionDonut from './HealthDistributionDonut';

const GlobalKPIBanner = ({ projects, jiraIssues }) => {
  // Calculate global KPIs
  const totalTestCases = projects.reduce((sum, project) => sum + project.total, 0);
  const totalPassed = projects.reduce((sum, project) => sum + project.passed, 0);
  const totalAutomated = projects.reduce((sum, project) => sum + project.automatedCount, 0);
  const overallPassRate = totalTestCases > 0 ? Math.round((totalPassed / totalTestCases) * 100) : 0;
  const overallAutomationRate = totalTestCases > 0 ? Math.round((totalAutomated / totalTestCases) * 100) : 0;

  // Calculate open defects by priority
  const openDefects = jiraIssues?.filter(issue => issue.status === 'Open') || [];
  const p1Defects = openDefects.filter(issue => issue.priority === 'High').length;
  const p2Defects = openDefects.filter(issue => issue.priority === 'Medium').length;
  const p3Defects = openDefects.filter(issue => issue.priority === 'Low').length;

  return (
    <div className="global-kpi-banner">
      {/* Health Distribution Donut as a KPI */}
      <div className="kpi-item kpi-donut">
        <HealthDistributionDonut projects={projects} compact />
      </div>
      <div className="kpi-item">
        <div className="kpi-label">Total Test Cases</div>
        <div className="kpi-value">
          <AnimatedNumber value={totalTestCases} duration={1000} format={v => v.toLocaleString()} />
        </div>
      </div>
      <div className="kpi-item">
        <div className="kpi-label">Overall Pass Rate</div>
        <div className="kpi-value pass-rate">
          <div className="kpi-number">
            <AnimatedNumber value={overallPassRate} duration={1000} format={v => `${v}%`} />
          </div>
          <div className="kpi-gauge">
            <div 
              className="gauge-fill" 
              style={{ 
                width: `${overallPassRate}%`,
                backgroundColor: overallPassRate >= 80 ? '#22c55e' : overallPassRate >= 60 ? '#f59e0b' : '#ef4444'
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="kpi-item">
        <div className="kpi-label">Automation Rate</div>
        <div className="kpi-value automation-rate">
          <div className="kpi-number">
            <AnimatedNumber value={overallAutomationRate} duration={1000} format={v => `${v}%`} />
          </div>
          <div className="kpi-gauge">
            <div 
              className="gauge-fill" 
              style={{ 
                width: `${overallAutomationRate}%`,
                backgroundColor: '#3b82f6'
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="kpi-item">
        <div className="kpi-label">Open Defects</div>
        <div className="kpi-value defects-count">
          <div className="kpi-number">
            <AnimatedNumber value={openDefects.length} duration={1000} />
          </div>
          <div className="priority-indicators">
            <span className="priority-pill p1" title={`${p1Defects} P1 defects`}>
              P1: <AnimatedNumber value={p1Defects} duration={1000} />
            </span>
            <span className="priority-pill p2" title={`${p2Defects} P2 defects`}>
              P2: <AnimatedNumber value={p2Defects} duration={1000} />
            </span>
            <span className="priority-pill p3" title={`${p3Defects} P3 defects`}>
              P3: <AnimatedNumber value={p3Defects} duration={1000} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalKPIBanner; 