import React, { useState, useEffect } from 'react';
import ComponentSelector from './ComponentSelector';
import DraggableWidget from './DraggableWidget';
import { getProjectDashboardData } from '../api/testcases';

const CustomDashboard = ({ testCases, jiraIssues, summary, selectedProject, onBack }) => {
  const [widgets, setWidgets] = useState([]);
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved dashboard configuration
  useEffect(() => {
    const storageKey = selectedProject 
      ? `customDashboard_${selectedProject.projectId}` 
      : 'customDashboard';
    const savedDashboard = localStorage.getItem(storageKey);
    if (savedDashboard) {
      setWidgets(JSON.parse(savedDashboard));
    } else {
      // Clear widgets when switching to a project without saved config
      setWidgets([]);
    }
  }, [selectedProject]);

  // Save dashboard configuration
  useEffect(() => {
    const storageKey = selectedProject 
      ? `customDashboard_${selectedProject.projectId}` 
      : 'customDashboard';
    localStorage.setItem(storageKey, JSON.stringify(widgets));
  }, [widgets, selectedProject]);

  // Fetch project-specific data when selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      const fetchProjectData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getProjectDashboardData(selectedProject.projectId);
          setProjectData(data);
        } catch (err) {
          setError(err.message || 'Failed to fetch project data');
          console.error('Error fetching project data:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchProjectData();
    } else {
      setProjectData(null);
    }
  }, [selectedProject]);

  const addWidget = (widgetType, config = {}) => {
    // Calculate a better initial position to spread widgets out
    const widgetCount = widgets.length;
    const cols = 3; // Number of columns to arrange widgets in
    const col = widgetCount % cols;
    const row = Math.floor(widgetCount / cols);
    
    const newWidget = {
      id: Date.now(),
      type: widgetType,
      position: { 
        x: col * 450 + 50, // 450px width + 50px spacing
        y: row * 350 + 50   // 350px height + 50px spacing
      },
      size: config.size || { width: 400, height: 300 },
      config: config,
    };
    setWidgets([...widgets, newWidget]);
    setIsAddingWidget(false);
  };

  const updateWidget = (id, updates) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ));
  };

  const deleteWidget = (id) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const clearAllWidgets = () => {
    if (window.confirm('Are you sure you want to clear all widgets? This action cannot be undone.')) {
      setWidgets([]);
    }
  };

  const handleDragStart = (widget) => {
    setDraggedWidget(widget);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedWidget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      updateWidget(draggedWidget.id, {
        position: { x: Math.max(0, x - 100), y: Math.max(0, y - 50) }
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Determine which data to use
  const getDataToUse = () => {
    if (selectedProject && projectData) {
      return {
        testCases: projectData.testCases,
        jiraIssues: projectData.jiraIssues,
        summary: projectData.summary
      };
    }
    return {
      testCases,
      jiraIssues,
      summary
    };
  };

  const { testCases: currentTestCases, jiraIssues: currentJiraIssues, summary: currentSummary } = getDataToUse();

  // Show loading state when fetching project data
  if (selectedProject && loading) {
    return (
      <div className="custom-dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h2>{selectedProject.projectName} - Custom Dashboard</h2>
          </div>
        </div>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading project data...</p>
        </div>
      </div>
    );
  }

  // Show error state if data fetching failed
  if (selectedProject && error) {
    return (
      <div className="custom-dashboard">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h2>{selectedProject.projectName} - Custom Dashboard</h2>
          </div>
        </div>
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Project Data</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>
            {selectedProject ? `${selectedProject.projectName} - Custom Dashboard` : 'My Custom Dashboard'}
          </h2>
          {selectedProject && (
            <div className="project-info">
              <span className="project-sprint">{selectedProject.sprint}</span>
              <span className="project-health">
                Health: {Math.round((selectedProject.passed / selectedProject.total) * 100)}%
              </span>
            </div>
          )}
        </div>
        <div className="dashboard-actions">
          <button 
            className="back-btn"
            onClick={onBack}
            title="Go back to previous page"
          >
            ← Back
          </button>
          {widgets.length > 0 && (
            <button 
              className="clear-all-btn"
              onClick={clearAllWidgets}
              title="Clear all widgets"
            >
              🗑️ Clear All
            </button>
          )}
          <button 
            className="add-widget-btn"
            onClick={() => setIsAddingWidget(true)}
            title="Add new widget"
            disabled={selectedProject && loading}
          >
            <span className="plus-icon">+</span>
            Add Widget
          </button>
        </div>
      </div>

      <div 
        className={`dashboard-canvas ${draggedWidget ? 'dragging-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {widgets.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-dashboard-content">
              <div className="empty-icon">📊</div>
              <h3>
                {selectedProject 
                  ? `Create Dashboard for ${selectedProject.projectName}` 
                  : 'Create Your Personal Dashboard'}
              </h3>
              <p>
                {selectedProject 
                  ? `Add widgets to track ${selectedProject.projectName} metrics, test results, and project-specific information.`
                  : 'Click the "+" button above to add widgets like charts, test case summaries, issue trackers, and more!'}
              </p>
              <button 
                className="add-widget-btn primary"
                onClick={() => setIsAddingWidget(true)}
              >
                <span className="plus-icon">+</span>
                Add Your First Widget
              </button>
            </div>
          </div>
        ) : (
          <>
            {widgets.map(widget => (
               <DraggableWidget
                 key={widget.id}
                 widget={widget}
                 testCases={currentTestCases}
                 jiraIssues={currentJiraIssues}
                 summary={currentSummary}
                 selectedProject={selectedProject}
                 onUpdate={updateWidget}
                 onDelete={deleteWidget}
                 onDragStart={handleDragStart}
                 onDragEnd={handleDragEnd}
               />
             ))}
          </>
        )}
      </div>

      {isAddingWidget && (
        <ComponentSelector
          onSelect={addWidget}
          onClose={() => setIsAddingWidget(false)}
          testCases={currentTestCases}
          jiraIssues={currentJiraIssues}
          summary={currentSummary}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
};

export default CustomDashboard; 