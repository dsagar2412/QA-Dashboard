import React, { useState } from 'react';
import TestCasePieChart from './TestCasePieChart';
import DefectsChart from './DefectsChart';

const DraggableWidget = ({ 
  widget, 
  testCases, 
  jiraIssues, 
  summary, 
  onUpdate, 
  onDelete, 
  onDragStart, 
  onDragEnd 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDragStart = (e) => {
    onDragStart(widget);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    onDragEnd();
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
    switch (widget.type) {
      case 'summary-cards':
        return <SummaryCards testCases={testCases} jiraIssues={jiraIssues} />;
      case 'quick-stats':
        return <QuickStats testCases={testCases} jiraIssues={jiraIssues} />;
      case 'pie-chart':
        return <TestCasePieChart testCases={testCases} />;
      case 'defects-chart':
        return <DefectsChart jiraIssues={jiraIssues} />;
      case 'recent-tests':
        return <RecentTests testCases={testCases} />;
      case 'failed-tests':
        return <FailedTests testCases={testCases} />;
      case 'automation-coverage':
        return <AutomationCoverage testCases={testCases} />;
      case 'active-issues':
        return <ActiveIssues jiraIssues={jiraIssues} />;
      case 'priority-breakdown':
        return <PriorityBreakdown jiraIssues={jiraIssues} />;
      case 'notes':
        return <NotesWidget widget={widget} onUpdate={onUpdate} />;
      case 'links':
        return <LinksWidget widget={widget} onUpdate={onUpdate} />;
      case 'calendar':
        return <CalendarWidget />;
      default:
        return <div>Widget type not found</div>;
    }
  };

  return (
    <div
      className="draggable-widget"
      style={{
        position: 'absolute',
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="widget-header">
        <span className="widget-title">{widget.config.title}</span>
        <div className="widget-controls">
          <button 
            className="widget-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </button>
          {showMenu && (
            <div className="widget-menu">
              <button onClick={() => onDelete(widget.id)}>Delete</button>
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
const SummaryCards = ({ testCases, jiraIssues }) => {
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

  return (
    <div className="mini-dashboard-grid">
      {cards.map((card, index) => (
        <div key={index} className="mini-card">
          <div className="mini-card-title">{card.title}</div>
          <div className="mini-card-value" style={{ color: card.color }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

const QuickStats = ({ testCases, jiraIssues }) => {
  const automatedTests = testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated').length;
  const automationRate = testCases.length > 0 ? Math.round((automatedTests / testCases.length) * 100) : 0;

  return (
    <div className="quick-stats">
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

const RecentTests = ({ testCases }) => {
  return (
    <div className="recent-tests">
      {testCases.slice(0, 6).map(tc => (
        <div key={tc.id} className="test-item">
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

const FailedTests = ({ testCases }) => {
  const failedTests = testCases.filter(tc => tc.status?.toLowerCase() === 'failed');
  
  return (
    <div className="failed-tests">
      {failedTests.length === 0 ? (
        <div className="no-failures">🎉 No failed tests!</div>
      ) : (
        failedTests.slice(0, 5).map(tc => (
          <div key={tc.id} className="failed-test-item">
            <div className="test-title">{tc.title}</div>
            <div className="test-date">{tc.executedAt}</div>
          </div>
        ))
      )}
    </div>
  );
};

const AutomationCoverage = ({ testCases }) => {
  const automatedTests = testCases.filter(tc => tc.automationType?.toLowerCase() === 'automated').length;
  const coverage = testCases.length > 0 ? (automatedTests / testCases.length) * 100 : 0;

  return (
    <div className="automation-coverage">
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

const ActiveIssues = ({ jiraIssues }) => {
  return (
    <div className="active-issues">
      {jiraIssues?.slice(0, 5).map(issue => (
        <div key={issue.id} className="issue-item">
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

const PriorityBreakdown = ({ jiraIssues }) => {
  const priorities = jiraIssues?.reduce((acc, issue) => {
    const priority = issue.priority || 'Unknown';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="priority-breakdown">
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

const NotesWidget = ({ widget, onUpdate }) => {
  const [notes, setNotes] = useState(widget.config.notes || '');

  const handleNotesChange = (value) => {
    setNotes(value);
    onUpdate(widget.id, {
      config: { ...widget.config, notes: value }
    });
  };

  return (
    <div className="notes-widget">
      <textarea
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        placeholder="Add your notes here..."
        className="notes-textarea"
      />
    </div>
  );
};

const LinksWidget = ({ widget, onUpdate }) => {
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

  return (
    <div className="links-widget">
      <div className="links-list">
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
        />
        <input
          type="url"
          placeholder="URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
        />
        <button onClick={addLink}>+</button>
      </div>
    </div>
  );
};

const CalendarWidget = () => {
  const today = new Date();
  const month = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <div className="calendar-widget">
      <div className="calendar-header">{month}</div>
      <div className="calendar-today">
        <div className="today-date">{today.getDate()}</div>
        <div className="today-day">{today.toLocaleDateString('en-US', { weekday: 'long' })}</div>
      </div>
    </div>
  );
};

export default DraggableWidget; 