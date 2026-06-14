# ♻️ Smart Waste Management System (WasteWise)

A modern, full-stack Smart Waste Management System developed as a **DBMS Mini Project**. The platform leverages real-time statistics, role-based access controls, automated notification warnings, and interactive database exploration to optimize civic waste disposal and collection schedules.

---

## 🚀 Key Features

* **📊 Dynamic Admin Dashboard**: Visualizes real-time metrics (Total Bins, Full/Overflowing Bins, Active Workers, Pending Reports) with interactive charts demonstrating avg waste levels by area and weekly collection trends.
* **👤 Role-Based Access Control (RBAC)**: Supports three target user groups with distinct portals and permissions:
  - **Admin**: Manages garbage vehicles, system users, smart bins, and collection tasks.
  - **Worker**: Views assigned collection duties, receives target warnings, and marks tasks as completed.
  - **Citizen**: Reports overflow complaints, submits community feedback, and tracks complaint statuses.
* **🗑️ Smart Bin Tracking**: Bins monitor their fill levels (e.g., triggering warning notifications to assigned workers if capacity crosses or equals `80%`).
* **📌 Task & Report Workflows**: Smooth lifecycle integration from Citizen complaint submission ➡️ Admin task assignment ➡️ Worker collection ➡️ Resolution update.
* **🔔 Live Notifications**: Triggers system alerts for task assignments, complaint status updates, and bin overflow warnings.
* **🔍 Built-in Database Explorer**: Administrative tool to inspect database collections (Users, Bins, Tasks, Reports, Vehicles, Notifications, Feedbacks, and Activity logs) directly in the app.
* **📝 Activity Logging**: Tracks administrative actions and transactions as audit logs.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite, TailwindCSS, React Router, Chart.js | Responsive, rich-aesthetics user interface |
| **Backend** | Node.js, Express.js | Secure RESTful API with JSON Web Token (JWT) auth |
| **Database** | MongoDB Atlas, Mongoose | Cloud document database with schemas and indexes |
| **Styling** | Vanilla CSS, TailwindCSS | Modern dark mode, glassmorphism, micro-animations |

---

## 📂 Project Structure

```text
smart-waste-management-main/
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable layout and route guard components
│   │   ├── pages/          # Page components (Dashboard, DatabaseViewer, Bins, etc.)
│   │   └── utils/          # API services and helpers
│   └── package.json
└── server/                 # Backend Node.js/Express API
    ├── controllers/        # Business logic for all collections
    ├── models/             # Mongoose schemas and database models
    ├── routes/             # Express API routes
    ├── seeds/              # Database seeder scripts
    └── package.json
```

---

## ⚙️ Setup and Installation

### 📋 Prerequisites
* **Node.js** (v16+ recommended)
* A **MongoDB Atlas** database URI or local MongoDB server

### 🔧 Configuration
Create a `.env` file inside the `server` directory with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 🗄️ Database Seeding
Populate the database collections with sample mock data (users, bins, reports, vehicles):
```bash
# In the server/ directory:
npm install
npm run seed
```

### 🏃 Running the Application

To start the application, run the backend API server and frontend client concurrently:

#### 1. Start the Backend API Server:
```bash
# In the server/ directory:
npm run dev
# Server runs on http://localhost:5000/
# API endpoints at http://localhost:5000/api
```

#### 2. Start the Frontend Client:
```bash
# In the client/ directory:
npm install
npm run dev
# Frontend runs on http://localhost:3000/
```

---

## 👤 Credentials for Evaluation
Use these pre-seeded users to log in and explore different portals:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@wastewise.com` | `password123` |
| **Worker** | `worker@wastewise.com` | `password123` |
| **Citizen** | `citizen@wastewise.com` | `password123` |

