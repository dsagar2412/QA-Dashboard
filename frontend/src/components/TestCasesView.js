import React, { useState, useMemo, useCallback, useEffect } from 'react';

// Counter Animation Component
const CounterAnimation = ({ targetValue, duration = 2000, suffix = '', color = '#2d3748', delay = 0 }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const numericTarget = typeof targetValue === 'string' ? 
      parseInt(targetValue.replace(/[^\d]/g, '')) : targetValue;
    
    if (numericTarget === 0) {
      setCurrentValue(0);
      return;
    }

    const timer = setTimeout(() => {
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

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetValue, duration, delay]);

  return (
    <span style={{ 
      color: color,
      opacity: currentValue === 0 ? 0.3 : 1,
      transform: `scale(${currentValue === 0 ? 0.8 : 1})`,
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      display: 'inline-block'
    }}>
      {currentValue}{suffix}
    </span>
  );
};

const TestCasesView = React.memo(({ testCases }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [automationFilter, setAutomationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Event handlers with useCallback
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleAutomationFilterChange = useCallback((e) => {
    setAutomationFilter(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  // Memoized status color functions
  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'passed': return '#22c55e';
      case 'failed': return '#ef4444';
      case 'blocked': return '#f59e0b';
      default: return '#6b7280';
    }
  }, []);

  const getStatusBg = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'passed': return '#f0fff4';
      case 'failed': return '#fef5e7';
      case 'blocked': return '#fffbeb';
      default: return '#f8fafc';
    }
  }, []);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = testCases.length;
    const passed = testCases.filter(tc => tc.status?.toLowerCase() === 'passed').length;
    const failed = testCases.filter(tc => tc.status?.toLowerCase() === 'failed').length;
    const blocked = testCases.filter(tc => tc.status?.toLowerCase() === 'blocked').length;
    const manual = testCases.filter(tc => tc.automationType?.toLowerCase() === 'manual').length;
    const automated = testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated').length;
    
    return {
      total,
      passed,
      failed,
      blocked,
      manual,
      automated,
      successRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      automationRate: total > 0 ? Math.round((automated / total) * 100) : 0
    };
  }, [testCases]);

  // Filter and sort test cases
  const filteredAndSortedTestCases = useMemo(() => {
    let filtered = testCases.filter(tc => {
      // Status filter
      if (statusFilter !== 'all' && tc.status?.toLowerCase() !== statusFilter) {
        return false;
      }
      
      // Automation type filter
      if (automationFilter !== 'all' && tc.automationType?.toLowerCase() !== automationFilter) {
        return false;
      }
      
      // Search filter
      if (debouncedSearchTerm && !tc.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.executedAt) - new Date(a.executedAt);
        case 'oldest':
          return new Date(a.executedAt) - new Date(b.executedAt);
        case 'name':
          return a.title?.localeCompare(b.title) || 0;
        case 'status':
          return a.status?.localeCompare(b.status) || 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [testCases, statusFilter, automationFilter, sortBy, debouncedSearchTerm]);



  return (
    <div className="test-cases-view" style={{ height: 'calc(100vh - 130px)', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '1.5rem',
        animation: 'fadeInUp 0.6s ease-out',
        opacity: 0,
        animationFillMode: 'forwards'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
          Test Cases Management
        </h2>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>
          Manage and analyze all test cases with filtering and sorting options
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '1.5rem',
        width: '100%'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          animation: 'cardSlideIn 0.6s ease-out 0.1s both',
          transform: 'translateY(20px)',
          opacity: 0
        }}>
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Total Test Cases</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748' }}>
            <CounterAnimation targetValue={summary.total} duration={2000} delay={200} />
          </div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          animation: 'cardSlideIn 0.6s ease-out 0.2s both',
          transform: 'translateY(20px)',
          opacity: 0
        }}>
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Success Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>
            <CounterAnimation targetValue={summary.successRate} duration={2500} suffix="%" color="#22c55e" delay={400} />
          </div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          animation: 'cardSlideIn 0.6s ease-out 0.3s both',
          transform: 'translateY(20px)',
          opacity: 0
        }}>
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Automation Coverage</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            <CounterAnimation targetValue={summary.automationRate} duration={2800} suffix="%" color="#8b5cf6" delay={600} />
          </div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          animation: 'cardSlideIn 0.6s ease-out 0.4s both',
          transform: 'translateY(20px)',
          opacity: 0
        }}>
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Status Distribution</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>
              ✓ <CounterAnimation targetValue={summary.passed} duration={1800} color="#22c55e" delay={800} />
            </span>
            <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>
              ✗ <CounterAnimation targetValue={summary.failed} duration={2000} color="#ef4444" delay={1000} />
            </span>
            <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
              ⚠ <CounterAnimation targetValue={summary.blocked} duration={2200} color="#f59e0b" delay={1200} />
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div style={{ 
        background: 'white', 
        padding: '1.25rem', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0',
        marginBottom: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        alignItems: 'center',
        width: '100%',
        animation: 'fadeInUp 0.6s ease-out 0.5s both',
        transform: 'translateY(20px)',
        opacity: 0
      }}>
        {/* Search */}
        <div style={{ flex: '2', minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search test cases..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.6rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#4a5568', marginRight: '0.5rem' }}>Status:</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Automation Filter */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#4a5568', marginRight: '0.5rem' }}>Type:</label>
          <select
            value={automationFilter}
            onChange={handleAutomationFilterChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Types</option>
            <option value="manual">Manual</option>
            <option value="automated">Automated</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#4a5568', marginRight: '0.5rem' }}>Sort by:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Results Count */}
        <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>
          Showing {filteredAndSortedTestCases.length} of {testCases.length} test cases
        </div>
      </div>

      {/* Test Cases List */}
      <div className="test-cases-table" style={{ 
        background: 'white', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        animation: 'fadeInUp 0.6s ease-out 0.6s both',
        transform: 'translateY(20px)',
        opacity: 0
      }}>
        {/* Header */}
        <div className="grid-header" style={{ 
          display: 'grid', 
          gridTemplateColumns: '3fr 1fr 1.2fr 1.2fr 1fr', 
          gap: '1.5rem',
          padding: '1.25rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#4a5568'
        }}>
          <div>Test Case Name</div>
          <div>Status</div>
          <div>Type</div>
          <div>Executed At</div>
          <div>Duration</div>
        </div>

        {/* Test Cases */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredAndSortedTestCases.map((tc, index) => (
            <div
              key={tc.id}
              className="grid-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr 1.2fr 1.2fr 1fr',
                gap: '1.5rem',
                padding: '1.25rem',
                borderBottom: index < filteredAndSortedTestCases.length - 1 ? '1px solid #f1f5f9' : 'none',
                fontSize: '0.9rem',
                alignItems: 'center',
                backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
              }}
            >
              <div style={{ fontWeight: '500', color: '#2d3748' }}>
                {tc.title}
              </div>
              
              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: getStatusColor(tc.status),
                  backgroundColor: getStatusBg(tc.status),
                  border: `1px solid ${getStatusColor(tc.status)}`
                }}>
                  {tc.status || 'Unknown'}
                </span>
              </div>
              
              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  color: tc.automationType?.toLowerCase() === 'automated' ? '#8b5cf6' : '#3b82f6',
                  backgroundColor: tc.automationType?.toLowerCase() === 'automated' ? '#ede9fe' : '#eff6ff',
                  border: `1px solid ${tc.automationType?.toLowerCase() === 'automated' ? '#8b5cf6' : '#3b82f6'}`
                }}>
                  {tc.automationType?.toLowerCase() === 'automated' ? '🤖' : '👤'} {tc.automationType || 'Manual'}
                </span>
              </div>
              
              <div style={{ color: '#4a5568', fontSize: '0.8rem' }}>
                {tc.executedAt ? new Date(tc.executedAt).toLocaleDateString() : 'N/A'}
              </div>
              
              <div style={{ color: '#4a5568', fontSize: '0.8rem' }}>
                {tc.duration || 'N/A'}
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedTestCases.length === 0 && (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#6b7280',
            fontSize: '0.95rem'
          }}>
            No test cases found matching the current filters.
          </div>
        )}
      </div>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes cardSlideIn {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .test-cases-view .grid-row:hover {
          background-color: #f8fafc !important;
          transform: translateX(3px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
});

export default TestCasesView; 