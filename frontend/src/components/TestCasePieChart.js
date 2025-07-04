import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TestCasePieChart = React.memo(({ testCases, widgetSize }) => {
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

  // Calculate responsive dimensions based on widget size
  const getChartDimensions = () => {
    if (!widgetSize) {
      return { width: 200, height: 200, fontSize: '0.75rem' };
    }
    
    const { width, height } = widgetSize;
    
    // Calculate chart size based on available space
    const availableWidth = width - 40; // Account for padding
    const availableHeight = height - 120; // Account for header and legend
    
    // Determine chart size - can be smaller or larger than default
    let chartWidth, chartHeight, fontSize;
    
    if (availableWidth < 300 || availableHeight < 200) {
      // Small widget
      chartWidth = Math.min(120, availableWidth);
      chartHeight = Math.min(120, availableHeight);
      fontSize = '0.7rem';
    } else if (availableWidth < 500 || availableHeight < 300) {
      // Medium widget
      chartWidth = Math.min(160, availableWidth);
      chartHeight = Math.min(160, availableHeight);
      fontSize = '0.75rem';
    } else if (availableWidth < 800 || availableHeight < 500) {
      // Large widget
      chartWidth = Math.min(250, availableWidth);
      chartHeight = Math.min(250, availableHeight);
      fontSize = '0.8rem';
    } else {
      // Extra large widget
      chartWidth = Math.min(350, availableWidth);
      chartHeight = Math.min(350, availableHeight);
      fontSize = '0.9rem';
    }
    
    return { width: chartWidth, height: chartHeight, fontSize };
  };

  const { width: chartWidth, height: chartHeight, fontSize } = getChartDimensions();

  const renderPieChart = (data, outerData, title, total, successRate) => {
    // Calculate responsive radii based on chart size
    const outerRadius = chartWidth * 0.375; // 75% of half width
    const innerRadius = chartWidth * 0.325; // 65% of half width
    const innerInnerRadius = chartWidth * 0.175; // 35% of half width
    
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title" style={{ 
            fontSize: fontSize === '0.7rem' ? '0.9rem' : 
                     fontSize === '0.75rem' ? '1rem' : 
                     fontSize === '0.8rem' ? '1.1rem' : '1.2rem' 
          }}>
            {title} ({total})
          </h3>
          <div style={{ fontSize: fontSize, color: '#4a5568' }}>
            {successRate}% Success
          </div>
        </div>
        
        <div className="chart-wrapper">
          <ResponsiveContainer width={chartWidth} height={chartHeight}>
            <PieChart>
              {/* Outer decorative ring */}
              <Pie
                data={outerData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
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
                innerRadius={innerInnerRadius}
                outerRadius={innerRadius}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`inner-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="chart-legend" style={{ fontSize: fontSize }}>
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
  };

  return (
    <div className="pie-charts-container">
      {renderPieChart(manualData, manualOuterData, 'Manual Tests', manualTotal, manualSuccessRate)}
      {renderPieChart(automatedData, automatedOuterData, 'Automated Tests', automatedTotal, automatedSuccessRate)}
    </div>
  );
});

export default TestCasePieChart; 