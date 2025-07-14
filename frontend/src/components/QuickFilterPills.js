import React, { useState } from 'react';

const QuickFilterPills = ({ projects, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState([]);

  // Extract unique testers and modules from projects
  const testers = [...new Set(projects.flatMap(project => {
    // Mock tester names based on project data
    return [
      `Tester ${project.projectId}`,
      `QA Lead ${project.projectId}`,
      `Automation ${project.projectId}`
    ];
  }))];

  const modules = [...new Set(projects.flatMap(project => {
    // Mock module names based on project data
    return [
      'Authentication',
      'User Management',
      'Payment Processing',
      'Reporting',
      'API Integration',
      'Database',
      'UI Components',
      'Security',
      'Performance',
      'Mobile'
    ];
  }))];

  const handleFilterClick = (filterType, value) => {
    const filterKey = `${filterType}:${value}`;
    let newActiveFilters;
    
    if (activeFilters.includes(filterKey)) {
      newActiveFilters = activeFilters.filter(f => f !== filterKey);
    } else {
      newActiveFilters = [...activeFilters, filterKey];
    }
    
    setActiveFilters(newActiveFilters);
    onFilterChange(newActiveFilters);
  };

  const isFilterActive = (filterType, value) => {
    return activeFilters.includes(`${filterType}:${value}`);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="quick-filter-pills">
      <div className="filter-section">
        <h5>Filter by Tester</h5>
        <div className="pills-container">
          {testers.slice(0, 6).map(tester => (
            <button
              key={tester}
              className={`filter-pill ${isFilterActive('tester', tester) ? 'active' : ''}`}
              onClick={() => handleFilterClick('tester', tester)}
            >
              👤 {tester}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h5>Filter by Module</h5>
        <div className="pills-container">
          {modules.slice(0, 8).map(module => (
            <button
              key={module}
              className={`filter-pill ${isFilterActive('module', module) ? 'active' : ''}`}
              onClick={() => handleFilterClick('module', module)}
            >
              📦 {module}
            </button>
          ))}
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="filter-actions">
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            ✕ Clear All Filters ({activeFilters.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickFilterPills; 