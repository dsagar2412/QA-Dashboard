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

const IssuesView = React.memo(({ jiraIssues }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handlePriorityFilterChange = useCallback((e) => {
    setPriorityFilter(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleViewIssue = useCallback((issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedIssue(null);
  }, []);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = jiraIssues.length;
    const open = jiraIssues.filter(issue => issue.status?.toLowerCase() === 'open').length;
    const inProgress = jiraIssues.filter(issue => issue.status?.toLowerCase() === 'in progress').length;
    const resolved = jiraIssues.filter(issue => issue.status?.toLowerCase() === 'resolved').length;
    const closed = jiraIssues.filter(issue => issue.status?.toLowerCase() === 'closed').length;
    
    const critical = jiraIssues.filter(issue => issue.priority?.toLowerCase() === 'critical').length;
    const high = jiraIssues.filter(issue => issue.priority?.toLowerCase() === 'high').length;
    const medium = jiraIssues.filter(issue => issue.priority?.toLowerCase() === 'medium').length;
    const low = jiraIssues.filter(issue => issue.priority?.toLowerCase() === 'low').length;
    
    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      critical,
      high,
      medium,
      low,
      activeIssues: open + inProgress,
      resolvedRate: total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0
    };
  }, [jiraIssues]);

  // Filter and sort issues
  const filteredAndSortedIssues = useMemo(() => {
    let filtered = jiraIssues.filter(issue => {
      // Status filter
      if (statusFilter !== 'all' && issue.status?.toLowerCase() !== statusFilter) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== 'all' && issue.priority?.toLowerCase() !== priorityFilter) {
        return false;
      }
      
      // Search filter
      if (debouncedSearchTerm && !issue.summary?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id; // Assuming higher ID means newer
        case 'oldest':
          return a.id - b.id;
        case 'summary':
          return a.summary?.localeCompare(b.summary) || 0;
        case 'priority':
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          return (priorityOrder[b.priority?.toLowerCase()] || 0) - (priorityOrder[a.priority?.toLowerCase()] || 0);
        case 'status':
          return a.status?.localeCompare(b.status) || 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [jiraIssues, statusFilter, priorityFilter, sortBy, debouncedSearchTerm]);

  // Memoized color and icon functions
  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#ef4444';
      case 'in progress': return '#f59e0b';
      case 'resolved': return '#22c55e';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  }, []);

  const getStatusBg = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#fef5e7';
      case 'in progress': return '#fffbeb';
      case 'resolved': return '#f0fff4';
      case 'closed': return '#f8fafc';
      default: return '#f8fafc';
    }
  }, []);

  const getPriorityColor = useCallback((priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  }, []);

  const getPriorityBg = useCallback((priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#fef2f2';
      case 'high': return '#fff7ed';
      case 'medium': return '#fefce8';
      case 'low': return '#f0fdf4';
      default: return '#f8fafc';
    }
  }, []);

  const getPriorityIcon = useCallback((priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }, []);



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
          Issues Management
        </h2>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>
          Track and manage all project issues with filtering and sorting options
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
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Total Issues</div>
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
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Active Issues</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>
            <CounterAnimation targetValue={summary.activeIssues} duration={2200} color="#ef4444" delay={400} />
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
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Resolution Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>
            <CounterAnimation targetValue={summary.resolvedRate} duration={2500} suffix="%" color="#22c55e" delay={600} />
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
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.5rem' }}>Priority Distribution</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>
              🔴 <CounterAnimation targetValue={summary.critical} duration={1800} color="#dc2626" delay={800} />
            </span>
            <span style={{ color: '#ea580c', fontSize: '0.8rem' }}>
              🟠 <CounterAnimation targetValue={summary.high} duration={2000} color="#ea580c" delay={1000} />
            </span>
            <span style={{ color: '#ca8a04', fontSize: '0.8rem' }}>
              🟡 <CounterAnimation targetValue={summary.medium} duration={2200} color="#ca8a04" delay={1200} />
            </span>
            <span style={{ color: '#16a34a', fontSize: '0.8rem' }}>
              🟢 <CounterAnimation targetValue={summary.low} duration={2400} color="#16a34a" delay={1400} />
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
            placeholder="Search issues..."
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
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#4a5568', marginRight: '0.5rem' }}>Priority:</label>
          <select
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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
            <option value="priority">Priority</option>
            <option value="summary">Summary A-Z</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Results Count */}
        <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>
          Showing {filteredAndSortedIssues.length} of {jiraIssues.length} issues
        </div>
      </div>

      {/* Issues List */}
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
          gridTemplateColumns: '0.5fr 3fr 1.2fr 1.2fr 1fr', 
          gap: '1.5rem',
          padding: '1.25rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#4a5568'
        }}>
          <div>ID</div>
          <div>Issue Summary</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Actions</div>
        </div>

        {/* Issues */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredAndSortedIssues.map((issue, index) => (
            <div
              key={issue.id}
              className="grid-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '0.5fr 3fr 1.2fr 1.2fr 1fr',
                gap: '1.5rem',
                padding: '1.25rem',
                borderBottom: index < filteredAndSortedIssues.length - 1 ? '1px solid #f1f5f9' : 'none',
                fontSize: '0.9rem',
                alignItems: 'center',
                backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
              }}
            >
              <div style={{ fontWeight: '500', color: '#6b7280', fontSize: '0.8rem' }}>
                #{issue.id}
              </div>
              
              <div style={{ fontWeight: '500', color: '#2d3748' }}>
                {issue.summary}
              </div>
              
              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: getStatusColor(issue.status),
                  backgroundColor: getStatusBg(issue.status),
                  border: `1px solid ${getStatusColor(issue.status)}`
                }}>
                  {issue.status || 'Unknown'}
                </span>
              </div>
              
              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: getPriorityColor(issue.priority),
                  backgroundColor: getPriorityBg(issue.priority),
                  border: `1px solid ${getPriorityColor(issue.priority)}`
                }}>
                  {getPriorityIcon(issue.priority)} {issue.priority || 'Unknown'}
                </span>
              </div>
              
              <div>
                <button 
                  onClick={() => handleViewIssue(issue)}
                  style={{
                    background: 'none',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.75rem',
                    color: '#4a5568',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedIssues.length === 0 && (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#6b7280',
            fontSize: '0.95rem'
          }}>
            No issues found matching the current filters.
          </div>
        )}
      </div>

      {/* Issue Details Modal */}
      {showModal && selectedIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem'
                }}>
                  Issue #{selectedIssue.id}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  {selectedIssue.summary}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Status and Priority */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Status
                  </h4>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: getStatusColor(selectedIssue.status),
                    backgroundColor: getStatusBg(selectedIssue.status),
                    border: `2px solid ${getStatusColor(selectedIssue.status)}`,
                    display: 'inline-block'
                  }}>
                    {selectedIssue.status || 'Unknown'}
                  </span>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Priority
                  </h4>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: getPriorityColor(selectedIssue.priority),
                    backgroundColor: getPriorityBg(selectedIssue.priority),
                    border: `2px solid ${getPriorityColor(selectedIssue.priority)}`,
                    display: 'inline-block'
                  }}>
                    {getPriorityIcon(selectedIssue.priority)} {selectedIssue.priority || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Details
                </h4>
                <div style={{
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'grid',
                    gap: '0.75rem',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Issue ID:</span>
                      <span style={{ fontWeight: '500' }}>#{selectedIssue.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Assignee:</span>
                      <span style={{ fontWeight: '500' }}>{selectedIssue.assignee || 'Unassigned'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Reporter:</span>
                      <span style={{ fontWeight: '500' }}>{selectedIssue.reporter || 'Unknown'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Type:</span>
                      <span style={{ fontWeight: '500' }}>{selectedIssue.issueType || 'Bug'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedIssue.description && (
                <div>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Description
                  </h4>
                  <p style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    color: '#4a5568',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {selectedIssue.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

export default IssuesView; 