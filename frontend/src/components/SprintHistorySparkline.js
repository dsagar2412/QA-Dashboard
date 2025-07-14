import React from 'react';

const SprintHistorySparkline = ({ data, color = '#3b82f6', width = 60, height = 20 }) => {
  // Generate mock sprint history data if not provided
  const generateMockData = () => {
    const baseValue = data || 75; // Use provided data as base or default to 75
    const points = [];
    
    for (let i = 0; i < 5; i++) {
      const variation = (Math.random() - 0.5) * 20; // ±10 variation
      points.push(Math.max(0, Math.min(100, baseValue + variation)));
    }
    
    return points;
  };

  const sparklineData = generateMockData();
  const maxValue = Math.max(...sparklineData);
  const minValue = Math.min(...sparklineData);

  // Calculate SVG path
  const pathData = sparklineData.map((value, index) => {
    const x = (index / (sparklineData.length - 1)) * width;
    const y = height - ((value - minValue) / (maxValue - minValue)) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Calculate trend direction
  const trend = sparklineData[sparklineData.length - 1] > sparklineData[0] ? 'up' : 'down';
  const trendColor = trend === 'up' ? '#22c55e' : '#ef4444';

  return (
    <div className="sprint-history-sparkline">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background area */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
        />
        
        {/* Line */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Start and end points */}
        <circle
          cx="0"
          cy={height - ((sparklineData[0] - minValue) / (maxValue - minValue)) * height}
          r="1.5"
          fill={color}
        />
        <circle
          cx={width}
          cy={height - ((sparklineData[sparklineData.length - 1] - minValue) / (maxValue - minValue)) * height}
          r="1.5"
          fill={trendColor}
        />
        
        {/* Trend indicator */}
        <text
          x={width - 8}
          y={height - 2}
          fontSize="8"
          fill={trendColor}
          textAnchor="end"
        >
          {trend === 'up' ? '↗' : '↘'}
        </text>
      </svg>
    </div>
  );
};

export default SprintHistorySparkline; 