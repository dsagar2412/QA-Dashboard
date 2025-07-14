import React from 'react';

const TestExecutionTrend = ({ projects }) => {
  // Generate mock trend data for the last 30 days
  const generateTrendData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random execution data based on total test cases
      const totalTests = projects.reduce((sum, project) => sum + project.total, 0);
      const baseExecution = Math.floor(totalTests * 0.1); // 10% of total tests per day
      const randomVariation = Math.floor(Math.random() * baseExecution * 0.5);
      const executed = Math.max(0, baseExecution + randomVariation);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        executed,
        passed: Math.floor(executed * 0.85), // Assume 85% pass rate
        failed: Math.floor(executed * 0.12), // Assume 12% fail rate
        blocked: Math.floor(executed * 0.03)  // Assume 3% blocked rate
      });
    }
    
    return data;
  };

  const trendData = generateTrendData();
  const maxExecuted = Math.max(...trendData.map(d => d.executed));
  const chartHeight = 120;
  const chartWidth = 400;

  return (
    <div className="test-execution-trend">
      <h4>Test Execution Trend (Last 30 Days)</h4>
      <div className="trend-chart">
        <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent, index) => (
            <g key={index}>
              <line
                x1="0"
                y1={chartHeight - (percent / 100) * chartHeight}
                x2={chartWidth}
                y2={chartHeight - (percent / 100) * chartHeight}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x="-5"
                y={chartHeight - (percent / 100) * chartHeight}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {Math.round((percent / 100) * maxExecuted)}
              </text>
            </g>
          ))}
          
          {/* Line chart */}
          <polyline
            points={trendData.map((d, i) => 
              `${(i / (trendData.length - 1)) * chartWidth},${chartHeight - (d.executed / maxExecuted) * chartHeight}`
            ).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {trendData.map((d, i) => (
            <circle
              key={i}
              cx={(i / (trendData.length - 1)) * chartWidth}
              cy={chartHeight - (d.executed / maxExecuted) * chartHeight}
              r="3"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          ))}
          
          {/* X-axis labels (every 5 days) */}
          {trendData.filter((_, i) => i % 5 === 0).map((d, i) => (
            <text
              key={i}
              x={(i * 5 / (trendData.length - 1)) * chartWidth}
              y={chartHeight + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {d.date}
            </text>
          ))}
        </svg>
        
        <div className="trend-stats">
          <div className="trend-stat">
            <span className="stat-label">Total Executed:</span>
            <span className="stat-value">{trendData.reduce((sum, d) => sum + d.executed, 0).toLocaleString()}</span>
          </div>
          <div className="trend-stat">
            <span className="stat-label">Avg/Day:</span>
            <span className="stat-value">{Math.round(trendData.reduce((sum, d) => sum + d.executed, 0) / trendData.length)}</span>
          </div>
          <div className="trend-stat">
            <span className="stat-label">Peak:</span>
            <span className="stat-value">{Math.max(...trendData.map(d => d.executed))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExecutionTrend; 