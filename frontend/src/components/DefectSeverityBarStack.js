import React from 'react';

const DefectSeverityBarStack = ({ jiraIssues }) => {
  // Calculate defects by severity
  const openDefects = jiraIssues?.filter(issue => issue.status === 'Open') || [];
  const p1Defects = openDefects.filter(issue => issue.priority === 'High');
  const p2Defects = openDefects.filter(issue => issue.priority === 'Medium');
  const p3Defects = openDefects.filter(issue => issue.priority === 'Low');

  const totalDefects = openDefects.length;
  const maxDefects = Math.max(p1Defects.length, p2Defects.length, p3Defects.length, 1);

  const chartHeight = 120;
  const chartWidth = 200;
  const barWidth = 60;
  const barSpacing = 20;

  return (
    <div className="defect-severity-bar-stack">
      <h4>Open Defects by Severity</h4>
      <div className="bar-chart">
        <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent, index) => (
            <line
              key={index}
              x1="0"
              y1={chartHeight - (percent / 100) * chartHeight}
              x2={chartWidth}
              y2={chartHeight - (percent / 100) * chartHeight}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* P1 Bar */}
          <g>
            <rect
              x={barSpacing}
              y={chartHeight - (p1Defects.length / maxDefects) * chartHeight}
              width={barWidth}
              height={(p1Defects.length / maxDefects) * chartHeight}
              fill="#ef4444"
              rx="4"
            />
            <text
              x={barSpacing + barWidth / 2}
              y={chartHeight - (p1Defects.length / maxDefects) * chartHeight - 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#ef4444"
            >
              {p1Defects.length}
            </text>
            <text
              x={barSpacing + barWidth / 2}
              y={chartHeight + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              P1
            </text>
          </g>
          
          {/* P2 Bar */}
          <g>
            <rect
              x={barSpacing * 2 + barWidth}
              y={chartHeight - (p2Defects.length / maxDefects) * chartHeight}
              width={barWidth}
              height={(p2Defects.length / maxDefects) * chartHeight}
              fill="#f59e0b"
              rx="4"
            />
            <text
              x={barSpacing * 2 + barWidth + barWidth / 2}
              y={chartHeight - (p2Defects.length / maxDefects) * chartHeight - 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#f59e0b"
            >
              {p2Defects.length}
            </text>
            <text
              x={barSpacing * 2 + barWidth + barWidth / 2}
              y={chartHeight + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              P2
            </text>
          </g>
          
          {/* P3 Bar */}
          <g>
            <rect
              x={barSpacing * 3 + barWidth * 2}
              y={chartHeight - (p3Defects.length / maxDefects) * chartHeight}
              width={barWidth}
              height={(p3Defects.length / maxDefects) * chartHeight}
              fill="#3b82f6"
              rx="4"
            />
            <text
              x={barSpacing * 3 + barWidth * 2 + barWidth / 2}
              y={chartHeight - (p3Defects.length / maxDefects) * chartHeight - 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#3b82f6"
            >
              {p3Defects.length}
            </text>
            <text
              x={barSpacing * 3 + barWidth * 2 + barWidth / 2}
              y={chartHeight + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              P3
            </text>
          </g>
        </svg>
        
        <div className="severity-stats">
          <div className="severity-stat">
            <span className="severity-label p1">P1 (Critical):</span>
            <span className="severity-value">{p1Defects.length}</span>
          </div>
          <div className="severity-stat">
            <span className="severity-label p2">P2 (High):</span>
            <span className="severity-value">{p2Defects.length}</span>
          </div>
          <div className="severity-stat">
            <span className="severity-label p3">P3 (Medium):</span>
            <span className="severity-value">{p3Defects.length}</span>
          </div>
          <div className="severity-stat total">
            <span className="severity-label">Total:</span>
            <span className="severity-value">{totalDefects}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefectSeverityBarStack; 