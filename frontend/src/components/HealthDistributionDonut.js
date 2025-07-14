import React, { useState } from 'react';

const HealthDistributionDonut = ({ projects, compact }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Calculate health distribution
  const healthCounts = projects.reduce((acc, project) => {
    const passRate = project.total > 0 ? (project.passed / project.total) * 100 : 0;
    let status;
    if (passRate >= 80) status = 'healthy';
    else if (passRate >= 60) status = 'warning';
    else status = 'critical';
    
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const total = projects.length;
  const healthyCount = healthCounts.healthy || 0;
  const warningCount = healthCounts.warning || 0;
  const criticalCount = healthCounts.critical || 0;

  // Donut size
  const radius = compact ? 24 : 40;
  const strokeWidth = compact ? 8 : 12;
  const centerX = compact ? 30 : 60;
  const centerY = compact ? 30 : 60;
  const svgSize = compact ? 60 : 120;

  // Calculate angles for donut chart
  const healthyAngle = (healthyCount / total) * 360;
  const warningAngle = (warningCount / total) * 360;
  const criticalAngle = (criticalCount / total) * 360;

  // Generate SVG path for each slice
  const createSlice = (startAngle, endAngle, color) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return {
      path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      color
    };
  };

  const slices = [
    { ...createSlice(0, healthyAngle, '#22c55e'), label: 'Healthy', count: healthyCount },
    { ...createSlice(healthyAngle, healthyAngle + warningAngle, '#f59e0b'), label: 'Warning', count: warningCount },
    { ...createSlice(healthyAngle + warningAngle, 360, '#ef4444'), label: 'Critical', count: criticalCount }
  ];

  return (
    <div className={`health-distribution-donut${compact ? ' compact' : ''}`}>
      {!compact && <h4>Project Health Distribution</h4>}
      <div className="donut-container" style={compact ? { margin: '0 auto' } : {}}>
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.path}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                onMouseEnter={!compact ? () => setHoveredSlice(index) : undefined}
                onMouseLeave={!compact ? () => setHoveredSlice(null) : undefined}
                style={{
                  filter: hoveredSlice === index && !compact ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none',
                  cursor: !compact ? 'pointer' : 'default'
                }}
              />
            </g>
          ))}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - strokeWidth / 2}
            fill="white"
          />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={compact ? '10' : '12'}
            fontWeight="bold"
            fill="#4a5568"
          >
            {total}
          </text>
        </svg>
        {!compact && hoveredSlice !== null && (
          <div className="donut-tooltip">
            <div className="tooltip-label">{slices[hoveredSlice].label}</div>
            <div className="tooltip-count">{slices[hoveredSlice].count} projects</div>
            <div className="tooltip-percentage">
              {Math.round((slices[hoveredSlice].count / total) * 100)}%
            </div>
          </div>
        )}
      </div>
      <div className={`donut-legend${compact ? ' horizontal' : ''}`} style={compact ? { marginTop: 8 } : {}}>
        {slices.map((slice, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: slice.color }}></span>
            <span className="legend-label">{slice.label}</span>
            <span className="legend-count">({slice.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthDistributionDonut; 