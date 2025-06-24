import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#28a745', '#dc3545', '#ffc107'];

const SummaryChart = ({ summary }) => {
  const data = [
    { name: 'Passed', value: summary.Passed || 0 },
    { name: 'Failed', value: summary.Failed || 0 },
    { name: 'Blocked', value: summary.Blocked || 0 }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
      <h2>Test Case Status Breakdown</h2>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default SummaryChart;
6