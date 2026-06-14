# Smart Waste Management System — Project Status Report

This document provides a comprehensive analysis of the Smart Waste Management system, inspecting both the backend (Express & MongoDB) and frontend (React SPA with Tailwind CSS) codebases.

---

## 1. Existing Modules

### Backend (Express API)
- **Database Module (`server/config/db.js`)**: Establishes connection to MongoDB using Mongoose.
- **Authentication Middleware (`server/middleware/auth.js`)**: Validates JWT tokens and handles role-based authorization restrictions.
- **Models Module (`server/models/`)**: Defines Mongoose schemas for the 8 system collections.
- **Controllers Module (`server/controllers/`)**: Implements request handling and business logic for CRUD operations.
- **Routes Module (`server/routes/`)**: Mounts REST API endpoints and maps them to controllers.
- **Activity Logger Utility (`server/utils/activityLogger.js`)**: Records audit trail history for critical events.
- **Seed Module (`server/seeds/seed.js`)**: Populates the database with default administrative, citizen, and worker records.

### Frontend (React SPA)
- **App Router (`client/src/App.jsx`)**: Declares SPA routing with page guards (e.g. `ProtectedRoute`).
- **Auth Context (`client/src/context/AuthContext.jsx`)**: Manages session state, handles login/logout operations, and persists JWTs.
- **API Service Layer (`client/src/services/api.js`)**: Centralizes HTTP requests to the backend using Axios with interceptors to inject JWT headers.
- **Core UI Elements (`client/src/components/`)**:
  - `Navbar.jsx`: Global header navigation.
  - `Sidebar.jsx`: Collapsible dashboard panel with links customized by user role.
  - `Layout.jsx`: Structure enclosing page elements.
  - `StatusBadge.jsx`: Color-coded indicator for report, task, bin, and vehicle statuses.
  - `StatCard.jsx`: Metric display cards with subtle hover styling and icons.

---

## 2. Existing Pages

The frontend application implements **16 routing/dashboard pages**:
1. **Login (`/login`)**: Secure credentials-based authentication.
2. **Register (`/register`)**: New account sign-up for citizens.
3. **Dashboard (`/dashboard`)**: Entry point routing users dynamically based on role:
   - **Admin Dashboard**: Aggregates fleet counts, pending complaints, and displays analytic charts.
   - **Worker Dashboard**: Lists tasks, managed bins, and completion rates.
   - **Citizen Dashboard**: Displays complaint status history and shortcut actions.
4. **Bin Management (`/bins`)**: Full administrative view for tracking coordinates, status, fill level, and worker assignments.
5. **Waste Complaint Form (`/complaint`)**: Allows citizens to submit complaints linked to a specific bin.
6. **Waste Reports (`/reports`)**: Lists reported waste issues. Admins can update status (in-progress, resolved, rejected) or delete; workers can review complaints for their assigned bins.
7. **Collection Tasks (`/tasks`)**: Task manager. Workers update task progress, and admins dispatch tasks.
8. **Feedback (`/feedback`)**: Citizens rate services (1-5 stars); admins view feedback statistics and delete entries.
9. **Notifications (`/notifications`)**: User inbox. Supports marking as read and deletion.
10. **Vehicle Management (`/vehicles`)**: Fleet control for admins to track drivers and vehicle capacities.
11. **Users Management (`/users`)**: Administrator CRUD to view, create, edit, or delete users.
12. **Database Viewer (`/database`)**: Searchable, paginated, and sortable tabular display of database collections.
13. **Activity Logs (`/activity-logs`)**: Audit timeline filterable by action type, entity, or actor.

---

## 3. Existing APIs

The backend exposes the following API routes:

| HTTP Method | Route | Description | Auth Requirement |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/register` | User Self-Registration | Public |
| **POST** | `/api/login` | User Authentication | Public |
| **GET** | `/api/users` | List all users | Authenticated (Admin only) |
| **GET** | `/api/users/:id` | Fetch user detail | Authenticated (Admin only) |
| **POST** | `/api/users` | Create user | Authenticated (Admin only) |
| **PUT** | `/api/users/:id` | Update user details | Authenticated (Admin only) |
| **DELETE** | `/api/users/:id` | Delete user account | Authenticated (Admin only) |
| **GET** | `/api/bins` | List all bins | Authenticated (Any role) |
| **POST** | `/api/bins` | Create a bin | Authenticated (Any role) |
| **PUT** | `/api/bins/:id` | Edit bin details | Authenticated (Any role) |
| **DELETE** | `/api/bins/:id` | Delete a bin | Authenticated (Any role) |
| **GET** | `/api/reports` | List all waste reports | Authenticated (Any role) |
| **POST** | `/api/reports` | Submit a report | Authenticated (Any role) |
| **PUT** | `/api/reports/:id` | Update report status | Authenticated (Any role) |
| **DELETE** | `/api/reports/:id` | Delete a report | Authenticated (Admin only) |
| **GET** | `/api/tasks` | List all tasks | Authenticated (Any role) |
| **POST** | `/api/tasks` | Create collection task | Authenticated (Any role) |
| **PUT** | `/api/tasks/:id` | Update task status | Authenticated (Any role) |
| **DELETE** | `/api/tasks/:id` | Delete a task | Authenticated (Admin only) |
| **GET** | `/api/vehicles` | List all fleet vehicles | Authenticated (Any role) |
| **GET** | `/api/vehicles/:id` | Fetch vehicle details | Authenticated (Any role) |
| **POST** | `/api/vehicles` | Add vehicle to fleet | Authenticated (Admin only) |
| **PUT** | `/api/vehicles/:id` | Update vehicle details | Authenticated (Admin only) |
| **DELETE** | `/api/vehicles/:id` | Remove a vehicle | Authenticated (Admin only) |
| **GET** | `/api/feedback` | List all reviews | Authenticated (Any role) |
| **POST** | `/api/feedback` | Submit feedback | Authenticated (Any role) |
| **DELETE** | `/api/feedback/:id` | Delete feedback entry | Authenticated (Admin only) |
| **GET** | `/api/notifications` | List notifications | Authenticated (Any role) |
| **PUT** | `/api/notifications/:id` | Mark notification as read | Authenticated (Any role) |
| **DELETE** | `/api/notifications/:id` | Delete notification | Authenticated (Any role) |
| **GET** | `/api/activity-logs` | Retrieve audit history | Authenticated (Admin only) |
| **GET** | `/api/health` | Service health check | Public |

---

## 4. Existing MongoDB Collections & CRUD Operations

The MongoDB database maintains **8 collections**. The status of CRUD operations for each is summarized below:

### Collection Name: `users`
- **Create**: **Implemented** (`POST /api/register` for citizens, `POST /api/users` for admins)
- **Read**: **Implemented** (`GET /api/users` for list, `GET /api/users/:id` for individual)
- **Update**: **Implemented** (`PUT /api/users/:id`)
- **Delete**: **Implemented** (`DELETE /api/users/:id`)

### Collection Name: `bins`
- **Create**: **Implemented** (`POST /api/bins`)
- **Read**: **Implemented** (`GET /api/bins` for list; individual read by ID is **Missing**)
- **Update**: **Implemented** (`PUT /api/bins/:id`)
- **Delete**: **Implemented** (`DELETE /api/bins/:id`)

### Collection Name: `wastereports`
- **Create**: **Implemented** (`POST /api/reports`)
- **Read**: **Implemented** (`GET /api/reports` for list; individual read by ID is **Missing**)
- **Update**: **Implemented** (`PUT /api/reports/:id`)
- **Delete**: **Implemented** (`DELETE /api/reports/:id`)

### Collection Name: `collectiontasks`
- **Create**: **Implemented** (`POST /api/tasks`)
- **Read**: **Implemented** (`GET /api/tasks` for list; individual read by ID is **Missing**)
- **Update**: **Implemented** (`PUT /api/tasks/:id`)
- **Delete**: **Implemented** (`DELETE /api/tasks/:id`)

### Collection Name: `vehicles`
- **Create**: **Implemented** (`POST /api/vehicles`)
- **Read**: **Implemented** (`GET /api/vehicles` for list, `GET /api/vehicles/:id` for individual)
- **Update**: **Implemented** (`PUT /api/vehicles/:id`)
- **Delete**: **Implemented** (`DELETE /api/vehicles/:id`)

### Collection Name: `feedbacks`
- **Create**: **Implemented** (`POST /api/feedback`)
- **Read**: **Implemented** (`GET /api/feedback` for list; individual read by ID is **Missing**)
- **Update**: **Missing** (No endpoint or interface exists to edit feedback reviews)
- **Delete**: **Implemented** (`DELETE /api/feedback/:id`)

### Collection Name: `notifications`
- **Create**: **Missing** (No endpoint exists to post new notifications; notifications are only added during seeding)
- **Read**: **Implemented** (`GET /api/notifications` for list; individual read by ID is **Missing**)
- **Update**: **Implemented** (`PUT /api/notifications/:id` to toggle read status)
- **Delete**: **Implemented** (`DELETE /api/notifications/:id`)

### Collection Name: `activitylogs`
- **Create**: **Missing** (No REST API endpoint exists to insert records; log creation is handled internally in backend controllers using the `logActivity` utility function)
- **Read**: **Implemented** (`GET /api/activity-logs` for list; individual read by ID is **Missing**)
- **Update**: **Missing** (Omitted intentionally to preserve audit log immutability)
- **Delete**: **Missing** (Omitted intentionally to preserve audit log immutability)

---

## 5. Architectural Issues, Security Vulnerabilities & Gaps

### Missing CRUD Operations
- **Notifications Engine**: The backend is missing dynamic creation of notifications. While endpoints exist to read, mark as read, or delete alerts, there is no code in the application that *creates* notifications on actions like task assignment, full bins, or resolved complaints.
- **Feedback Updates**: Citizens cannot edit rating feedback or comments once submitted.
- **Individual Retrieval APIs**: No individual retrieval route (`GET /:id`) exists for Bins, Reports, Tasks, Feedback, or Notifications.

### Broken CRUD Operations & Vulnerabilities
- **Broken Access Control (Authorization Bypass)**:
  - Bins CRUD operations (`POST /api/bins`, `PUT /api/bins/:id`, `DELETE /api/bins/:id`) do not have the `authorize('admin')` middleware. Any authenticated citizen or worker can create, edit, or delete city bins.
  - Tasks creation and updates (`POST /api/tasks`, `PUT /api/tasks/:id`) lack role authorization. Anyone can create collection tasks or change their status.
  - Feedback retrieval (`GET /api/feedback`) does not restrict access. Any logged-in citizen can fetch and read all community feedback.
  - Waste Reports update (`PUT /api/reports/:id`) does not restrict who can change report status.
- **Insecure Direct Object Reference (IDOR / BOLA) on Notifications**:
  - `PUT /api/notifications/:id` and `DELETE /api/notifications/:id` execute modifications without verifying that the logged-in user is the actual recipient of the notification. Any user can manipulate or delete another user's inbox alerts.
- **Destructured User Update Logic**:
  - In `userController.js`, `updateUser` constructs the update object using destructured parameters. If parameters like `name` or `email` are not present in the body (a partial update request), they become `undefined`. When Mongoose saves this with `runValidators: true`, it triggers database validation errors.

### APIs without Frontend Integration
- **`GET /api/users/:id`**: Integrated in the frontend API service helper but never invoked on the pages (editing reads user data directly from the list state).
- **`GET /api/vehicles/:id`**: Route exists in the backend but has no corresponding helper in `api.js` or UI view.

### Frontend Pages without Backend Integration
- **Admin Dashboard Charts**: The weekly collections trend chart (`AdminDashboard.jsx`) relies entirely on mock data array values. No API aggregates historical metrics.
- **Waste Complaint Form (Image Upload)**: The citizen complaint image field is a manual URL text input. There is no file upload utility (such as Multer/Cloudinary) integrated with the backend API.

### Missing Admin Features
- **Broadcast Notifications**: No admin option is available to send system alerts or broad messages to citizens or workers.
- **Collection Vehicle-Task Binding**: Tasks do not reference vehicles. The fleet is managed separately, preventing admins from assigning specific trucks to collection routes.
- **Route Planning**: No maps or GPS coordinates are used on the frontend to suggest routes for workers.

### Missing Database Viewer Functionality
- **Exclusion of Activity Logs**: The `DatabaseViewer.jsx` tab list is missing the `activitylogs` collection, which forces admins to toggle to the separate Activity Logs page rather than view the database audits uniformly.
- **Read-Only Viewer**: The DBMS explorer page is purely read-only; it does not support creation, deletion, or editing of entries.

---

## 6. Actionable Fixes Roadmap

### HIGH PRIORITY FIXES
1. **Apply Route-Level Authorization Middleware**: Add `authorize('admin')` to all admin-specific routes in `binRoutes.js`, `taskRoutes.js`, and `feedbackRoutes.js` to secure database records against unauthorized modification.
2. **Mitigate BOLA on Notifications**: Modify `markAsRead` and `deleteNotification` in `notificationController.js` to verify that `notification.recipientId` matches `req.user._id` before proceeding.
3. **Refactor User Update Controller**: Update `updateUser` to dynamically compile the update payload from provided keys in `req.body`, resolving the validation error on partial updates.
4. **Trigger Notifications in Backend Logic**: Embed `Notification.create` triggers in relevant controllers (e.g., dispatching alerts on task assignment, notifying citizens when complaint status updates, and warning workers when a managed bin is full).

### MEDIUM PRIORITY FIXES
1. **Integrate Activity Logs in Database Explorer**: Add the `activitylogs` option to `DatabaseViewer.jsx` along with its column schema mapping so admins can inspect audits directly in the explorer.
2. **Build Historical Data Analytics API**: Create an aggregation endpoint (e.g. `GET /api/tasks/analytics/weekly`) to fetch historical collection metrics to replace mock chart variables in the Admin Dashboard.
3. **Add Individual Retrieve Endpoints**: Implement standard `GET /api/bins/:id`, `GET /api/reports/:id`, and `GET /api/tasks/:id` endpoints on the server.
4. **Implement Image Upload Service**: Integrate a library like Multer to accept multipart/form-data for waste report uploads on `POST /api/reports`.

### LOW PRIORITY FIXES
1. **Vehicle Task Assignment**: Update the `CollectionTask` model with a reference field to the `Vehicle` schema, allowing admins to associate fleet trucks with tasks.
2. **Database Viewer Modifiers**: Implement a single "Delete Document" button in the Database Viewer to streamline administrative cleanup.
3. **Location Mapping Integration**: Integrate a React maps wrapper (e.g. Leaflet) to plot coordinate mappings for bins on the admin and worker dashboards.
