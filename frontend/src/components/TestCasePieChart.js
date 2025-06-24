import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TestCasePieChart = React.memo(({ testCases }) => {
  // Memoize expensive calculations
  const { manualTestCases, automatedTestCases } = useMemo(() => ({
    manualTestCases: testCases.filter(tc => tc.automationType?.toLowerCase() === 'manual'),
    automatedTestCases: testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated')
  }), [testCases]);

  // Memoize status counts calculation
  const { manualStatusCounts, automatedStatusCounts } = useMemo(() => {
    const manualCounts = manualTestCases.reduce((acc, testCase) => {
      const status = testCase.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const automatedCounts = automatedTestCases.reduce((acc, testCase) => {
      const status = testCase.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      manualStatusCounts: manualCounts,
      automatedStatusCounts: automatedCounts
    };
  }, [manualTestCases, automatedTestCases]);

  // Manual test cases data
  const manualData = [
    { name: 'Passed', value: manualStatusCounts.passed || 0, color: '#22c55e' },
    { name: 'Failed', value: manualStatusCounts.failed || 0, color: '#ef4444' },
    { name: 'Blocked', value: manualStatusCounts.blocked || 0, color: '#f59e0b' },
  ];

  const manualOuterData = [
    { name: 'Passed', value: manualStatusCounts.passed || 0, color: '#4ade80' },
    { name: 'Failed', value: manualStatusCounts.failed || 0, color: '#f87171' },
    { name: 'Blocked', value: manualStatusCounts.blocked || 0, color: '#fbbf24' },
  ];

  // Automated test cases data
  const automatedData = [
    { name: 'Passed', value: automatedStatusCounts.passed || 0, color: '#22c55e' },
    { name: 'Failed', value: automatedStatusCounts.failed || 0, color: '#ef4444' },
    { name: 'Blocked', value: automatedStatusCounts.blocked || 0, color: '#f59e0b' },
  ];

  const automatedOuterData = [
    { name: 'Passed', value: automatedStatusCounts.passed || 0, color: '#4ade80' },
    { name: 'Failed', value: automatedStatusCounts.failed || 0, color: '#f87171' },
    { name: 'Blocked', value: automatedStatusCounts.blocked || 0, color: '#fbbf24' },
  ];

  const manualTotal = manualTestCases.length;
  const automatedTotal = automatedTestCases.length;
  const manualSuccessRate = manualTotal > 0 ? Math.round((manualStatusCounts.passed / manualTotal) * 100) : 0;
  const automatedSuccessRate = automatedTotal > 0 ? Math.round((automatedStatusCounts.passed / automatedTotal) * 100) : 0;

  const renderPieChart = (data, outerData, title, total, successRate) => (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{title} ({total})</h3>
        <div style={{ fontSize: '0.75rem', color: '#4a5568' }}>
          {successRate}% Success
        </div>
      </div>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            {/* Outer decorative ring */}
            <Pie
              data={outerData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={75}
              paddingAngle={1}
              dataKey="value"
            >
              {outerData.map((entry, index) => (
                <Cell key={`outer-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            
            {/* Main inner ring */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`inner-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="chart-legend">
          {data.map((entry, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="legend-label">{entry.name}</span>
              <span className="legend-value">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pie-charts-container">
      {renderPieChart(manualData, manualOuterData, 'Manual Tests', manualTotal, manualSuccessRate)}
      {renderPieChart(automatedData, automatedOuterData, 'Automated Tests', automatedTotal, automatedSuccessRate)}
    </div>
  );
});

export default TestCasePieChart; 