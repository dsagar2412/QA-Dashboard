import React, { useState, useEffect } from 'react';

// Counter Animation Component
const CounterAnimation = ({ targetValue, duration = 2000, suffix = '', color }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    // Extract numeric value if it contains %
    const numericTarget = typeof targetValue === 'string' ? 
      parseInt(targetValue.replace('%', '')) : targetValue;
    
    if (numericTarget === 0) {
      setCurrentValue(0);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(startValue + (numericTarget - startValue) * easeOutQuart);
      
      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start animation after a small delay
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetValue, duration]);

  return (
    <div 
      className="card-value" 
      style={{ 
        color: color,
        opacity: currentValue === 0 ? 0.3 : 1,
        transform: `scale(${currentValue === 0 ? 0.8 : 1})`,
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      {currentValue}{suffix}
    </div>
  );
};

const DashboardCards = React.memo(({ summary, testCases, jiraIssues }) => {
  const calculateSummary = () => {
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

  const stats = calculateSummary();
  const successRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
  
  // Count issues from JIRA issues
  const totalIssues = jiraIssues ? jiraIssues.length : 0;

  // Calculate automation coverage
  const automatedTestCases = testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated');
  const automationCoverage = stats.total > 0 ? Math.round((automatedTestCases.length / stats.total) * 100) : 0;

  const cards = [
    {
      title: 'Total Test Cases',
      value: stats.total,
      duration: 2000,
      color: '#3b82f6', // Bright blue
      type: 'number'
    },
    {
      title: 'Success Rate',
      value: successRate,
      duration: 2500,
      color: successRate >= 80 ? '#22c55e' : successRate >= 60 ? '#f59e0b' : '#ef4444', // Green, yellow, red
      type: 'percentage'
    },
    {
      title: 'Automation Coverage',
      value: automationCoverage,
      duration: 2800,
      color: automationCoverage >= 70 ? '#22c55e' : automationCoverage >= 40 ? '#f59e0b' : '#ef4444', // Green, yellow, red
      type: 'percentage'
    },
    {
      title: 'Active Issues',
      value: totalIssues,
      duration: 2200,
      color: '#ef4444', // Bright red
      type: 'number'
    },
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="dashboard-card"
          style={{
            animation: `cardSlideIn 0.6s ease-out ${index * 0.1}s both`,
            transform: 'translateY(20px)',
            opacity: 0
          }}
        >
          <div className="card-header">
            <div className="card-title">{card.title}</div>
          </div>
          <CounterAnimation
            targetValue={card.value}
            duration={card.duration}
            suffix={card.type === 'percentage' ? '%' : ''}
            color={card.color}
          />
        </div>
      ))}
      
      {/* Add CSS for card animations */}
      <style>{`
        @keyframes cardSlideIn {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .card-value {
          transition: all 0.3s ease;
        }
        
        .dashboard-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
        }
        
        .dashboard-card:hover .card-value {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
});

export default DashboardCards; 