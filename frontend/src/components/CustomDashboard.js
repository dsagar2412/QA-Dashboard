import React, { useState, useEffect } from 'react';
import ComponentSelector from './ComponentSelector';
import DraggableWidget from './DraggableWidget';

const CustomDashboard = ({ testCases, jiraIssues, summary }) => {
  const [widgets, setWidgets] = useState([]);
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);

  // Load saved dashboard configuration
  useEffect(() => {
    const savedDashboard = localStorage.getItem('customDashboard');
    if (savedDashboard) {
      setWidgets(JSON.parse(savedDashboard));
    }
  }, []);

  // Save dashboard configuration
  useEffect(() => {
    localStorage.setItem('customDashboard', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (widgetType, config = {}) => {
    const newWidget = {
      id: Date.now(),
      type: widgetType,
      position: { x: 0, y: widgets.length * 200 },
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

  return (
    <div className="custom-dashboard">
      <div className="dashboard-header">
        <h2>My Custom Dashboard</h2>
        <button 
          className="add-widget-btn"
          onClick={() => setIsAddingWidget(true)}
          title="Add new widget"
        >
          <span className="plus-icon">+</span>
          Add Widget
        </button>
      </div>

      <div 
        className="dashboard-canvas"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {widgets.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-dashboard-content">
              <div className="empty-icon">📊</div>
              <h3>Create Your Personal Dashboard</h3>
              <p>Click the "+" button above to add widgets like charts, test case summaries, issue trackers, and more!</p>
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
          widgets.map(widget => (
            <DraggableWidget
              key={widget.id}
              widget={widget}
              testCases={testCases}
              jiraIssues={jiraIssues}
              summary={summary}
              onUpdate={updateWidget}
              onDelete={deleteWidget}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </div>

      {isAddingWidget && (
        <ComponentSelector
          onSelect={addWidget}
          onClose={() => setIsAddingWidget(false)}
          testCases={testCases}
          jiraIssues={jiraIssues}
          summary={summary}
        />
      )}
    </div>
  );
};

export default CustomDashboard; 