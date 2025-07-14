# QA Dashboard Documentation

## 📋 Overview

A centralized QA dashboard for test case and issue tracking across multiple projects. Provides real-time insights into project health, test execution status, and defect management.

### Key Features
- **Multi-Project Dashboard**: Overview of all projects with health indicators
- **Custom Dashboards**: Drag-and-drop widgets for personalized views
- **Test Case Tracking**: Monitor test execution status and automation coverage
- **Issue Management**: Track JIRA issues with priority and status
- **Dark Mode**: Toggle between light and dark themes

### Tech Stack
- **Frontend**: React 19.1.0, Recharts, Axios
- **Backend**: Spring Boot 3.5.0, Java 17
- **Database**: MongoDB
- **Build**: Gradle, npm

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Java 17+
- MongoDB 4.4+

### Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd QA-Dashboard

# 2. Start Backend
cd backend
./gradlew bootRun
# Runs on http://localhost:8080

# 3. Start Frontend
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Database Configuration
```properties
# backend/src/main/resources/application.properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=dashboarddb
```

---

## 🎯 Features

### 1. Master Dashboard
- Global KPI banner showing overall metrics
- Project cards with health status indicators
- Search and filter projects
- Click project cards for detailed views

### 2. Custom Dashboard
- Drag-and-drop widget positioning
- Multiple widget types: charts, metrics, tables
- Project-specific configurations
- Saved layouts in local storage

### 3. Navigation
- **Master Dashboard**: Project overview
- **Projects**: Same as Master Dashboard
- **Test Cases**: Detailed test case management
- **Issues**: JIRA issue tracking
- **Milestones**: Project milestone view
- **Queries/Trends**: Analytics and trends

### 4. Widgets Available
- Summary Cards (metrics overview)
- Test Case Pie Chart (status distribution)
- Defects Chart (issue priority breakdown)
- Recent Test Executions
- Failed Tests List
- Automation Coverage
- Active Issues
- Notes and Links

---

## 📡 API Endpoints

### Dashboard
- `GET /api/dashboard/summary` - Get all project summaries
- `GET /api/dashboard/summary?projectId={id}` - Get specific project summary

### Test Cases
- `GET /api/testcases` - Get all test cases
- `GET /api/testcases?projectId={id}` - Get test cases for project
- `GET /api/testcases/summary` - Get test case summary stats
- `GET /api/testcases/summary?projectId={id}` - Get project test summary

### JIRA Issues
- `GET /api/jira/issues` - Get all JIRA issues
- `GET /api/jira/issues?projectId={id}` - Get issues for project

### TestRail (if configured)
- `GET /api/testrail/projects` - Get TestRail projects

---

## 🗄️ Data Models

### Project Snapshot
```json
{
  "projectId": 1,
  "projectName": "Zinnia Core",
  "sprint": "Sprint 6",
  "total": 150,
  "passed": 120,
  "failed": 20,
  "blocked": 10,
  "automatedCount": 100,
  "manualCount": 50,
  "updatedAt": "2024-01-15T10:30:00"
}
```

### Test Case
```json
{
  "id": "TC001",
  "title": "Login Test",
  "status": "Passed",
  "automationType": "automated",
  "executedAt": "2024-01-15T10:30:00",
  "projectId": "1"
}
```

### JIRA Issue
```json
{
  "id": "JIRA-123",
  "summary": "Login issue",
  "status": "Open",
  "priority": "High",
  "assignee": "John Doe",
  "projectId": "1"
}
```

---

## 🛠️ Development

### Project Structure
```
QA-Dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/          # API calls
│   │   └── App.js        # Main app
│   └── package.json
├── backend/
│   ├── src/main/java/com/onezinnia/dashboard/
│   │   ├── controller/   # REST controllers
│   │   ├── service/      # Business logic
│   │   └── model/        # Data models
│   └── build.gradle
└── README.md
```

### Adding New Widget
1. Create widget component in `frontend/src/components/`
2. Add widget type to `ComponentSelector.js`
3. Add render case to `DraggableWidget.js`


## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection**
```bash
# Check MongoDB status
sudo systemctl status mongod
sudo systemctl start mongod
```

**Port Already in Use**
```bash
# Find and kill process
lsof -i :8080
kill -9 <PID>
```

**Build Issues**
```bash
# Frontend
rm -rf node_modules && npm install

# Backend
./gradlew clean build
```

**CORS Issues**
- Backend already configured for `http://localhost:3000`
- Check if frontend is running on correct port

---

**Version**: 1.0.0  
**Last Updated**: January 2024 