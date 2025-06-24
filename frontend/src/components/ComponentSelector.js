import React, { useState } from 'react';

const ComponentSelector = ({ onSelect, onClose, testCases, jiraIssues, summary }) => {
  const [selectedCategory, setSelectedCategory] = useState('overview');

  const widgetCategories = {
    overview: {
      name: 'Overview Widgets',
      icon: '📊',
      widgets: [
        {
          type: 'summary-cards',
          name: 'Summary Cards',
          description: 'Display key metrics like total test cases, success rate, and active issues',
          icon: '📋',
          preview: '4 metric cards'
        },
        {
          type: 'quick-stats',
          name: 'Quick Stats',
          description: 'Compact overview of important numbers',
          icon: '🔢',
          preview: 'Condensed metrics'
        }
      ]
    },
    charts: {
      name: 'Charts & Graphs',
      icon: '📈',
      widgets: [
        {
          type: 'pie-chart',
          name: 'Test Status Pie Chart',
          description: 'Visual breakdown of test case statuses',
          icon: '🥧',
          preview: 'Passed/Failed/Blocked'
        },
        {
          type: 'defects-chart',
          name: 'Defects Chart',
          description: 'Issue severity and priority breakdown',
          icon: '🐛',
          preview: 'Issue distribution'
        },
        {
          type: 'trend-chart',
          name: 'Trend Chart',
          description: 'Test execution trends over time',
          icon: '📉',
          preview: 'Time-based trends'
        }
      ]
    },
    testcases: {
      name: 'Test Cases',
      icon: '🧪',
      widgets: [
        {
          type: 'recent-tests',
          name: 'Recent Test Executions',
          description: 'Latest test case results and status',
          icon: '⏰',
          preview: 'Last 10 executions'
        },
        {
          type: 'failed-tests',
          name: 'Failed Tests',
          description: 'Currently failing test cases that need attention',
          icon: '❌',
          preview: 'Failed test list'
        },
        {
          type: 'automation-coverage',
          name: 'Automation Coverage',
          description: 'Progress bar showing automation vs manual tests',
          icon: '🤖',
          preview: 'Coverage percentage'
        }
      ]
    },
    issues: {
      name: 'Issues & Defects',
      icon: '🚨',
      widgets: [
        {
          type: 'active-issues',
          name: 'Active Issues',
          description: 'List of open issues and their priorities',
          icon: '📝',
          preview: 'Current issues'
        },
        {
          type: 'priority-breakdown',
          name: 'Priority Breakdown',
          description: 'Issues categorized by priority levels',
          icon: '🔥',
          preview: 'Priority groups'
        },
        {
          type: 'assignee-workload',
          name: 'Assignee Workload',
          description: 'Issues distributed by team members',
          icon: '👥',
          preview: 'Team distribution'
        }
      ]
    },
    custom: {
      name: 'Custom Widgets',
      icon: '⚙️',
      widgets: [
        {
          type: 'notes',
          name: 'Notes Widget',
          description: 'Add personal notes and reminders',
          icon: '📓',
          preview: 'Text notes'
        },
        {
          type: 'links',
          name: 'Quick Links',
          description: 'Bookmarks to important resources',
          icon: '🔗',
          preview: 'Link collection'
        },
        {
          type: 'calendar',
          name: 'Mini Calendar',
          description: 'Small calendar for quick date reference',
          icon: '📅',
          preview: 'Current month'
        }
      ]
    }
  };

  const handleWidgetSelect = (widget) => {
    const sizeConfig = {
      'summary-cards': { width: 800, height: 200 },
      'quick-stats': { width: 300, height: 150 },
      'pie-chart': { width: 400, height: 300 },
      'defects-chart': { width: 500, height: 350 },
      'trend-chart': { width: 600, height: 300 },
      'recent-tests': { width: 500, height: 400 },
      'failed-tests': { width: 450, height: 300 },
      'automation-coverage': { width: 350, height: 150 },
      'active-issues': { width: 500, height: 350 },
      'priority-breakdown': { width: 350, height: 250 },
      'assignee-workload': { width: 400, height: 300 },
      'notes': { width: 300, height: 200 },
      'links': { width: 250, height: 200 },
      'calendar': { width: 300, height: 250 }
    };

    onSelect(widget.type, {
      size: sizeConfig[widget.type] || { width: 400, height: 300 },
      title: widget.name
    });
  };

  return (
    <div className="component-selector-overlay">
      <div className="component-selector-modal">
        <div className="modal-header">
          <h3>Add New Widget</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="selector-content">
          <div className="category-tabs">
            {Object.entries(widgetCategories).map(([key, category]) => (
              <button
                key={key}
                className={`category-tab ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

          <div className="widgets-grid">
            {widgetCategories[selectedCategory].widgets.map((widget) => (
              <div
                key={widget.type}
                className="widget-option"
                onClick={() => handleWidgetSelect(widget)}
              >
                <div className="widget-icon">{widget.icon}</div>
                <div className="widget-info">
                  <h4>{widget.name}</h4>
                  <p>{widget.description}</p>
                  <span className="widget-preview">{widget.preview}</span>
                </div>
                <div className="add-icon">+</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSelector; 