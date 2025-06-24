
# Zinnia QA Dashboard

A centralized QA dashboard that visualizes test case execution, issue tracking, and real-time QA metrics. Built using **React.js** for the frontend and **Spring Boot** for the backend, this dashboard is designed to help QA teams, developers, and managers monitor project health effectively.

---

## 📂 Project Structure

```
QA-Dashboard/
├── backend/   → Spring Boot project
├── frontend/  → React.js project
└── README.md
```

---

## 🚀 Features

- ✅ Modular dashboard built with React
- ✅ Customizable widget space (drag/drop metric blocks)
- ✅ Test Case & Issue pages with search, filter, and sort
- ✅ Backend APIs for mock data (ready for MongoDB & real integration)
- ✅ Designed for TestRail, JIRA, GitHub integrations
- ✅ Clean REST API structure for frontend consumption
- ✅ Google Sign-In was integrated (currently removed for faster testing)

---

## 🖥️ Tech Stack

| Layer    | Technology         |
|----------|--------------------|
| Frontend | React.js, CSS      |
| Backend  | Spring Boot (Java) |
| Auth     | Google OAuth 2.0 *(removed)* |
| DB       | MongoDB *(planned)* |

---

## 📦 Setup Instructions

### 🔧 Backend – Spring Boot

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Run the backend using Gradle:

   ```bash
   ./gradlew bootRun
   ```

3. Server starts at: `http://localhost:8080`

> 📌 Backend uses mock data now; MongoDB integration is coming next.

---

### 💻 Frontend – React

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm start
   ```

4. App runs at: `http://localhost:3000`

---

## 🛠️ Backend Endpoints

| Endpoint                         | Description                     |
|----------------------------------|---------------------------------|
| `/api/testcases`                | Get all test cases              |
| `/api/testcases/query`          | Filter/search test cases        |
| `/api/testcases/summary`        | Get pass/fail/blocked summary   |
| `/api/issues`                   | Get mock issue data             |
| `/api/testcases/delta` *(WIP)* | Compare metrics across sprints  |

---

## 🔮 Upcoming Features (Next Phase)

- 🔁 MongoDB integration
- 📊 Delta comparison between sprints
- 🎯 Real-time dashboard updates
- 🧪 Integration with live TestRail & JIRA data
- 🔐 Reintroduce Google OAuth securely

---

## 👨‍💻 Author

- **Dhruv Sagar** – Intern @ Zinnia  
- This project is part of a QA data visualization and automation reporting tool.

---

## 📄 License

This project is for internal learning/demo purposes and not publicly licensed for production.
