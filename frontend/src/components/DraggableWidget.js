import React, { useState } from 'react';
import TestCasePieChart from './TestCasePieChart';
import DefectsChart from './DefectsChart';

const DraggableWidget = ({ 
  widget, 
  testCases, 
  jiraIssues, 
  summary, 
  selectedProject,
  onUpdate, 
  onDelete, 
  onDragStart, 
  onDragEnd 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Debug showMenu state changes
  React.useEffect(() => {
    console.log('showMenu state changed to:', showMenu);
  }, [showMenu]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.widget-controls') && !event.target.closest('.widget-menu')) {
        console.log('Clicking outside, closing menu');
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Data is already project-specific from backend, no need to filter

  const handleMouseDown = (e) => {
    // Only allow dragging from the header, but not from menu elements
    if (!e.target.closest('.widget-header') || 
        e.target.closest('.widget-menu-btn') || 
        e.target.closest('.widget-menu') ||
        e.target.closest('button')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Add dragging class for visual feedback
    e.currentTarget.classList.add('dragging');
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const canvas = document.querySelector('.dashboard-canvas');
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const scrollTop = canvas.scrollTop;
    const scrollLeft = canvas.scrollLeft;
    
    const newX = e.clientX - canvasRect.left - dragOffset.x + scrollLeft;
    const newY = e.clientY - canvasRect.top - dragOffset.y + scrollTop;
    
    // Constrain to canvas bounds (including scroll area)
    const maxX = Math.max(0, canvas.scrollWidth - widget.size.width);
    const maxY = Math.max(0, canvas.scrollHeight - widget.size.height);
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    onUpdate(widget.id, {
      position: { x: constrainedX, y: constrainedY }
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Remove dragging class
      const widgetElement = document.querySelector('.draggable-widget.dragging');
      if (widgetElement) {
        widgetElement.classList.remove('dragging');
      }
    }
  };

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, widget.size.width, widget.size.height]);

  const handleDragStart = (e) => {
    // Prevent default HTML5 drag for better control
    e.preventDefault();
  };

  const handleDragEnd = () => {
    // This is now handled by mouse events
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete button clicked for widget:', widget.id);
    if (window.confirm('Are you sure you want to delete this widget?')) {
      console.log('Confirming deletion of widget:', widget.id);
      onDelete(widget.id);
      setShowMenu(false);
    }
  };

  const handleResize = (e, direction) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = widget.size.width;
    const startHeight = widget.size.height;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) newWidth = Math.max(200, startWidth + deltaX);
      if (direction.includes('left')) newWidth = Math.max(200, startWidth - deltaX);
      if (direction.includes('bottom')) newHeight = Math.max(150, startHeight + deltaY);
      if (direction.includes('top')) newHeight = Math.max(150, startHeight - deltaY);

      onUpdate(widget.id, {
        size: { width: newWidth, height: newHeight }
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderWidgetContent = () => {
    const widgetSize = widget.size;
    switch (widget.type) {
      case 'summary-cards':
        return <SummaryCards testCases={testCases} jiraIssues={jiraIssues} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'quick-stats':
        return <QuickStats testCases={testCases} jiraIssues={jiraIssues} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'pie-chart':
        return <TestCasePieChart testCases={testCases} widgetSize={widgetSize} />;
      case 'defects-chart':
        return <DefectsChart jiraIssues={jiraIssues} widgetSize={widgetSize} />;
      case 'recent-tests':
        return <RecentTests testCases={testCases} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'failed-tests':
        return <FailedTests testCases={testCases} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'automation-coverage':
        return <AutomationCoverage testCases={testCases} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'active-issues':
        return <ActiveIssues jiraIssues={jiraIssues} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'priority-breakdown':
        return <PriorityBreakdown jiraIssues={jiraIssues} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'notes':
        return <NotesWidget widget={widget} onUpdate={onUpdate} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'links':
        return <LinksWidget widget={widget} onUpdate={onUpdate} selectedProject={selectedProject} widgetSize={widgetSize} />;
      case 'calendar':
        return <CalendarWidget selectedProject={selectedProject} widgetSize={widgetSize} />;
      default:
        return <div>Widget type not found</div>;
    }
  };

  return (
    <div
      className={`draggable-widget ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: isDragging ? 1000 : 'auto',
      }}
      onMouseDown={handleMouseDown}
      draggable={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="widget-header" style={{ cursor: 'grab', userSelect: 'none' }}>
        <span className="widget-title">{widget.config.title}</span>
        <div className="widget-controls" style={{ position: 'relative' }}>
          <button 
            className="widget-menu-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Menu button clicked, current showMenu:', showMenu);
              setShowMenu(!showMenu);
            }}
            style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }}
          >
            ⋮
          </button>
          {showMenu && (
            <div 
              className="widget-menu" 
              style={{ 
                position: 'absolute',
                top: '100%',
                right: '0',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '120px',
                overflow: 'hidden'
              }}
            >
              <button 
                onClick={handleDelete} 
                style={{ 
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🗑️ Delete Widget
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="widget-content">
        {renderWidgetContent()}
      </div>

      {/* Resize handles */}
      <div 
        className="resize-handle bottom-right"
        onMouseDown={(e) => handleResize(e, 'bottom-right')}
      />
      <div 
        className="resize-handle bottom"
        onMouseDown={(e) => handleResize(e, 'bottom')}
      />
      <div 
        className="resize-handle right"
        onMouseDown={(e) => handleResize(e, 'right')}
      />
    </div>
  );
};

// Individual widget components
const SummaryCards = ({ testCases, jiraIssues, selectedProject, widgetSize }) => {
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
  const totalIssues = jiraIssues ? jiraIssues.length : 0;

  const cards = [
    { title: 'Total Tests', value: stats.total, color: '#3b82f6' },
    { title: 'Success Rate', value: `${successRate}%`, color: '#22c55e' },
    { title: 'Failed', value: stats.failed, color: '#ef4444' },
    { title: 'Active Issues', value: totalIssues, color: '#f59e0b' },
  ];

  // Determine grid layout based on widget size
  const getGridStyle = () => {
    const { width, height } = widgetSize;
    
    if (width < 400) {
      return { gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' };
    } else if (width < 600) {
      return { gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' };
    } else {
      return { gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' };
    }
  };

  const getCardStyle = () => {
    const { width, height } = widgetSize;
    
    if (width < 400) {
      return { padding: '0.5rem', fontSize: '0.8rem' };
    } else if (width < 600) {
      return { padding: '0.75rem', fontSize: '0.9rem' };
    } else {
      return { padding: '1rem', fontSize: '1rem' };
    }
  };

  return (
    <div className="mini-dashboard-grid" style={getGridStyle()}>
      {cards.map((card, index) => (
        <div key={index} className="mini-card" style={getCardStyle()}>
          <div className="mini-card-title">{card.title}</div>
          <div className="mini-card-value" style={{ color: card.color }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

const QuickStats = ({ testCases, jiraIssues, selectedProject, widgetSize }) => {
  const automatedTests = testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated').length;
  const automationRate = testCases.length > 0 ? Math.round((automatedTests / testCases.length) * 100) : 0;

  const getStatsStyle = () => {
    const { width, height } = widgetSize;
    return {
      fontSize: width < 300 ? '0.8rem' : '0.9rem',
      padding: width < 300 ? '0.5rem' : '0.75rem'
    };
  };

  return (
    <div className="quick-stats" style={getStatsStyle()}>
      <div className="stat-row">
        <span>Tests:</span>
        <span>{testCases.length}</span>
      </div>
      <div className="stat-row">
        <span>Issues:</span>
        <span>{jiraIssues?.length || 0}</span>
      </div>
      <div className="stat-row">
        <span>Automation:</span>
        <span>{automationRate}%</span>
      </div>
    </div>
  );
};

const RecentTests = ({ testCases, selectedProject, widgetSize }) => {
  // Determine number of items to show based on widget size
  const getItemCount = () => {
    const { width, height } = widgetSize;
    if (width < 300 || height < 200) return 3;
    if (width < 500 || height < 300) return 4;
    return 6;
  };

  const getItemStyle = () => {
    const { width, height } = widgetSize;
    if (width < 400) {
      return { padding: '0.5rem', fontSize: '0.8rem' };
    }
    return { padding: '0.75rem', fontSize: '0.9rem' };
  };

  return (
    <div className="recent-tests" style={{ maxHeight: widgetSize.height - 60 }}>
      {testCases.slice(0, getItemCount()).map(tc => (
        <div key={tc.id} className="test-item" style={getItemStyle()}>
          <div className="test-title">{tc.title}</div>
          <div className="test-meta">
            <span className={`status-${tc.status?.toLowerCase()}`}>
              {tc.status}
            </span>
            <span className="test-date">{tc.executedAt}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const FailedTests = ({ testCases, selectedProject, widgetSize }) => {
  const failedTests = testCases.filter(tc => tc.status?.toLowerCase() === 'failed');
  
  const getItemCount = () => {
    const { width, height } = widgetSize;
    if (width < 300 || height < 200) return 3;
    if (width < 500 || height < 300) return 4;
    return 5;
  };

  const getItemStyle = () => {
    const { width, height } = widgetSize;
    if (width < 400) {
      return { padding: '0.5rem', fontSize: '0.8rem' };
    }
    return { padding: '0.75rem', fontSize: '0.9rem' };
  };
  
  return (
    <div className="failed-tests" style={{ maxHeight: widgetSize.height - 60 }}>
      {failedTests.length === 0 ? (
        <div className="no-failures">🎉 No failed tests!</div>
      ) : (
        failedTests.slice(0, getItemCount()).map(tc => (
          <div key={tc.id} className="failed-test-item" style={getItemStyle()}>
            <div className="test-title">{tc.title}</div>
            <div className="test-date">{tc.executedAt}</div>
          </div>
        ))
      )}
    </div>
  );
};

const AutomationCoverage = ({ testCases, selectedProject, widgetSize }) => {
  const automatedTests = testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated').length;
  const coverage = testCases.length > 0 ? (automatedTests / testCases.length) * 100 : 0;

  const getCoverageStyle = () => {
    const { width, height } = widgetSize;
    return {
      fontSize: width < 300 ? '0.8rem' : '0.9rem',
      padding: width < 300 ? '0.5rem' : '0.75rem'
    };
  };

  return (
    <div className="automation-coverage" style={getCoverageStyle()}>
      <div className="coverage-text">
        <span>Automation Coverage</span>
        <span>{Math.round(coverage)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${coverage}%` }}
        />
      </div>
      <div className="coverage-details">
        <span>{automatedTests} automated</span>
        <span>{testCases.length - automatedTests} manual</span>
      </div>
    </div>
  );
};

const ActiveIssues = ({ jiraIssues, selectedProject, widgetSize }) => {
  // Determine number of items to show based on widget size
  const getItemCount = () => {
    const { width, height } = widgetSize;
    if (width < 300 || height < 200) return 3;
    if (width < 500 || height < 300) return 4;
    return 5;
  };

  const getItemStyle = () => {
    const { width, height } = widgetSize;
    if (width < 400) {
      return { padding: '0.5rem', fontSize: '0.8rem' };
    }
    return { padding: '0.75rem', fontSize: '0.9rem' };
  };

  return (
    <div className="active-issues" style={{ maxHeight: widgetSize.height - 60 }}>
      {jiraIssues?.slice(0, getItemCount()).map(issue => (
        <div key={issue.id} className="issue-item" style={getItemStyle()}>
          <div className="issue-title">{issue.summary}</div>
          <div className="issue-meta">
            <span className={`priority-${issue.priority?.toLowerCase()}`}>
              {issue.priority}
            </span>
            <span className="issue-assignee">{issue.assignee}</span>
          </div>
        </div>
      )) || <div>No issues found</div>}
    </div>
  );
};

const PriorityBreakdown = ({ jiraIssues, selectedProject, widgetSize }) => {
  const priorities = jiraIssues?.reduce((acc, issue) => {
    const priority = issue.priority || 'Unknown';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {}) || {};

  const getBreakdownStyle = () => {
    const { width, height } = widgetSize;
    return {
      fontSize: width < 300 ? '0.8rem' : '0.9rem',
      padding: width < 300 ? '0.5rem' : '0.75rem'
    };
  };

  return (
    <div className="priority-breakdown" style={getBreakdownStyle()}>
      {Object.entries(priorities).map(([priority, count]) => (
        <div key={priority} className="priority-row">
          <span className={`priority-${priority.toLowerCase()}`}>
            {priority}
          </span>
          <span className="priority-count">{count}</span>
        </div>
      ))}
    </div>
  );
};

const NotesWidget = ({ widget, onUpdate, selectedProject, widgetSize }) => {
  const [notes, setNotes] = useState(widget.config.notes || '');

  const handleNotesChange = (value) => {
    setNotes(value);
    onUpdate(widget.id, {
      config: { ...widget.config, notes: value }
    });
  };

  const getTextareaStyle = () => {
    const { width, height } = widgetSize;
    return {
      width: '100%',
      height: `${height - 80}px`,
      fontSize: width < 300 ? '0.8rem' : '0.9rem',
      padding: width < 300 ? '0.5rem' : '0.75rem',
      resize: 'none',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontFamily: 'inherit'
    };
  };

  return (
    <div className="notes-widget">
      <textarea
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        placeholder="Add your notes here..."
        style={getTextareaStyle()}
      />
    </div>
  );
};

const LinksWidget = ({ widget, onUpdate, selectedProject, widgetSize }) => {
  const [links, setLinks] = useState(widget.config.links || []);
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  const addLink = () => {
    if (newLink.name && newLink.url) {
      const updatedLinks = [...links, { ...newLink, id: Date.now() }];
      setLinks(updatedLinks);
      onUpdate(widget.id, {
        config: { ...widget.config, links: updatedLinks }
      });
      setNewLink({ name: '', url: '' });
    }
  };

  const removeLink = (id) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    onUpdate(widget.id, {
      config: { ...widget.config, links: updatedLinks }
    });
  };

  const getLinksStyle = () => {
    const { width, height } = widgetSize;
    return {
      fontSize: width < 300 ? '0.8rem' : '0.9rem',
      maxHeight: `${height - 120}px`,
      overflowY: 'auto'
    };
  };

  const getInputStyle = () => {
    const { width, height } = widgetSize;
    return {
      fontSize: width < 300 ? '0.7rem' : '0.8rem',
      padding: width < 300 ? '0.3rem' : '0.5rem'
    };
  };

  return (
    <div className="links-widget">
      <div className="links-list" style={getLinksStyle()}>
        {links.map(link => (
          <div key={link.id} className="link-item">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name}
            </a>
            <button onClick={() => removeLink(link.id)}>×</button>
          </div>
        ))}
      </div>
      <div className="add-link">
        <input
          type="text"
          placeholder="Link name"
          value={newLink.name}
          onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
          style={getInputStyle()}
        />
        <input
          type="url"
          placeholder="URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          style={getInputStyle()}
        />
        <button onClick={addLink}>+</button>
      </div>
    </div>
  );
};

const CalendarWidget = ({ selectedProject, widgetSize }) => {
  const today = new Date();
  const month = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const getCalendarStyle = () => {
    const { width, height } = widgetSize;
    return {
      fontSize: width < 300 ? '0.8rem' : '1rem',
      padding: width < 300 ? '0.5rem' : '0.75rem'
    };
  };

  const getDateStyle = () => {
    const { width, height } = widgetSize;
    return {
      fontSize: width < 300 ? '2rem' : '3rem',
      fontWeight: 'bold'
    };
  };
  
  return (
    <div className="calendar-widget" style={getCalendarStyle()}>
      <div className="calendar-header">{month}</div>
      <div className="calendar-today">
        <div className="today-date" style={getDateStyle()}>{today.getDate()}</div>
        <div className="today-day">{today.toLocaleDateString('en-US', { weekday: 'long' })}</div>
      </div>
    </div>
  );
};

export default DraggableWidget; 