import React from 'react';

const Sidebar = ({ activeItem, onItemClick, isCollapsed }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '/dashboard.png' },
    { id: 'custom-dashboard', label: 'Custom Dashboard', icon: '/dashboard.png' },
    { id: 'projects', label: 'Projects', icon: '/Projects.png' },
    { id: 'testcases', label: 'Test Cases', icon: '/Test Cases.png' },
    { id: 'issues', label: 'Issues', icon: '/Issues.png' },
    { id: 'milestones', label: 'Milestones', icon: '/Milestones.png' },
    { id: 'queries', label: 'Queries/Trends', icon: '/Queries.png' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <nav className="nav-menu">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemClick(item.id)}
          >
            <img 
              src={item.icon} 
              alt={item.label} 
              className="nav-icon"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 