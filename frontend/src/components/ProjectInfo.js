import React, { useState, useEffect } from 'react';

// Counter Animation Component for smaller numbers in sidebar
const CounterAnimation = ({ targetValue, duration = 1500, suffix = '', color, prefix = '' }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    // Extract numeric value if it contains % or other characters
    const numericTarget = typeof targetValue === 'string' ? 
      parseInt(targetValue.replace(/[^\d]/g, '')) : targetValue;
    
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
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(startValue + (numericTarget - startValue) * easeOutCubic);
      
      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start animation after a delay based on position
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(timer);
  }, [targetValue, duration]);

  return (
    <span style={{ 
      color: color,
      opacity: currentValue === 0 ? 0.5 : 1,
      transition: 'opacity 0.3s ease'
    }}>
      {prefix}{currentValue}{suffix}
    </span>
  );
};

const ProjectInfo = ({ summary, testCases }) => {
  // Calculate automation type distribution
  const manualTestCases = testCases.filter(tc => tc.automationType?.toLowerCase() === 'manual');
  const automatedTestCases = testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated');
  
  // Calculate success rates for each type
  const manualPassed = manualTestCases.filter(tc => tc.status?.toLowerCase() === 'passed').length;
  const automatedPassed = automatedTestCases.filter(tc => tc.status?.toLowerCase() === 'passed').length;
  
  const manualSuccessRate = manualTestCases.length > 0 ? Math.round((manualPassed / manualTestCases.length) * 100) : 0;
  const automatedSuccessRate = automatedTestCases.length > 0 ? Math.round((automatedPassed / automatedTestCases.length) * 100) : 0;
  const automationCoverage = testCases.length > 0 ? Math.round((automatedTestCases.length / testCases.length) * 100) : 0;
  const overallSuccess = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;
  
  return (
    <div className="project-sidebar">
      <div className="project-info">
        <h3 style={{ 
          animation: 'fadeInUp 0.6s ease-out',
          transform: 'translateY(10px)',
          opacity: 0,
          animationFillMode: 'forwards'
        }}>
          Project Insights
        </h3>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.1s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Team Size:</div>
          <div className="info-value">4 QA + 1 Lead</div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.2s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Current Sprint:</div>
          <div className="info-value">Sprint 6</div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.3s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Total Tests:</div>
          <div className="info-value">
            <CounterAnimation targetValue={summary.total || 0} duration={1800} />
          </div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.4s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Manual Tests:</div>
          <div className="info-value" style={{ color: '#3b82f6' }}>
            <CounterAnimation targetValue={manualTestCases.length} duration={2000} color="#3b82f6" />
            {' '}(
            <CounterAnimation targetValue={manualSuccessRate} duration={2200} suffix="%" color="#3b82f6" />
            )
          </div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.5s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Automated Tests:</div>
          <div className="info-value" style={{ color: '#8b5cf6' }}>
            <CounterAnimation targetValue={automatedTestCases.length} duration={2000} color="#8b5cf6" />
            {' '}(
            <CounterAnimation targetValue={automatedSuccessRate} duration={2200} suffix="%" color="#8b5cf6" />
            )
          </div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.6s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Automation Coverage:</div>
          <div className="info-value">
            <CounterAnimation targetValue={automationCoverage} duration={2400} suffix="%" />
          </div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.7s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Overall Success:</div>
          <div className="info-value">
            <CounterAnimation targetValue={overallSuccess} duration={2600} suffix="%" />
          </div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.8s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Status Distribution:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.3rem' }}>
            <span className="status-passed">
              ✓ <CounterAnimation targetValue={summary.passed || 0} duration={1600} color="#22c55e" />
            </span>
            <span className="status-failed">
              ✗ <CounterAnimation targetValue={summary.failed || 0} duration={1800} color="#ef4444" />
            </span>
            <span className="status-blocked">
              ⚠ <CounterAnimation targetValue={summary.blocked || 0} duration={2000} color="#f59e0b" />
            </span>
          </div>
        </div>
        
        <div className="info-item" style={{ 
          animation: 'fadeInUp 0.6s ease-out 0.9s both',
          transform: 'translateY(10px)',
          opacity: 0
        }}>
          <div className="info-label">Last Updated:</div>
          <div className="info-value">{new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .info-item:hover {
          background-color: rgba(59, 130, 246, 0.05);
          transform: translateX(3px);
          transition: all 0.3s ease;
          border-radius: 6px;
          padding: 0.8rem;
          margin: 0 -0.2rem 0.6rem -0.2rem;
        }
        
        .info-value {
          transition: all 0.3s ease;
        }
        
        .info-item:hover .info-value {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ProjectInfo; 