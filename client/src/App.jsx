import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BinManagement from './pages/BinManagement';
import WasteComplaintForm from './pages/WasteComplaintForm';
import CollectionTasks from './pages/CollectionTasks';
import VehicleManagement from './pages/VehicleManagement';
import Feedback from './pages/Feedback';
import Notifications from './pages/Notifications';
import Users from './pages/Users';
import WasteReports from './pages/WasteReports';
import DatabaseViewer from './pages/DatabaseViewer';
import ActivityLogs from './pages/ActivityLogs';

/**
 * Main App Router
 * Configures all routes for the application.
 * Uses ProtectedRoute to gate access and Layout for UI consistency.
 */
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bins" element={<BinManagement />} />
        <Route path="/complaint" element={<WasteComplaintForm />} />
        <Route path="/reports" element={<WasteReports />} /> 
        <Route path="/tasks" element={<CollectionTasks />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Admin Only Routes */}
        <Route path="/vehicles" element={
          <ProtectedRoute roles={['admin']}>
            <VehicleManagement />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute roles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/database" element={
          <ProtectedRoute roles={['admin']}>
            <DatabaseViewer />
          </ProtectedRoute>
        } />
        <Route path="/activity-logs" element={
          <ProtectedRoute roles={['admin']}>
            <ActivityLogs />
          </ProtectedRoute>
        } />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
