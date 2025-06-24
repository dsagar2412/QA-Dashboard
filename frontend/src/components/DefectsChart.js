import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DefectsChart = React.memo(({ jiraIssues }) => {
  // Memoize expensive calculations
  const { data, total } = useMemo(() => {
    const priorityCounts = jiraIssues.reduce((acc, issue) => {
      const priority = issue.priority?.toLowerCase() || 'unknown';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    // Use the same orange gradient as the header underline for all bars
    const chartData = [
      { 
        name: 'Critical', 
        count: priorityCounts.critical || 0,
        color: 'url(#headerOrangeGradient)'
      },
      { 
        name: 'High', 
        count: priorityCounts.high || 0,
        color: 'url(#headerOrangeGradient)'
      },
      { 
        name: 'Medium', 
        count: priorityCounts.medium || 0,
        color: 'url(#headerOrangeGradient)'
      },
      { 
        name: 'Low', 
        count: priorityCounts.low || 0,
        color: 'url(#headerOrangeGradient)'
      },
    ];

    return {
      data: chartData,
      total: jiraIssues.length
    };
  }, [jiraIssues]);
  console.log("Total issues:", total); // Debug log

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Issues Summary ({total})</h3>
        <div style={{ fontSize: '0.75rem', color: '#4a5568' }}>
          Priority Distribution
        </div>
      </div>
      
      <div className="chart-wrapper" style={{ flexDirection: 'column', gap: '1rem' }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            {/* Define the same gradient used in the header underline */}
            <defs>
              <linearGradient id="headerOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b35" stopOpacity={1} />
                <stop offset="50%" stopColor="#f7931e" stopOpacity={1} />
                <stop offset="100%" stopColor="#ffa726" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              interval={0}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              formatter={(value, name) => [value, 'Count']}
              labelStyle={{ color: '#2d3748' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '0.8rem'
              }}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Compact Legend without color dots since all bars use same gradient */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {data.map((entry, index) => (
            <div key={index} className="legend-item" style={{ gap: '0.2rem' }}>
              <span className="legend-label">{entry.name}</span>
              <span className="legend-value">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DefectsChart; 