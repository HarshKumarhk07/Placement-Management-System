import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import CompanyManagement from './pages/admin/CompanyManagement';
import DriveManagement from './pages/admin/DriveManagement';
import ApplicationManagement from './pages/admin/ApplicationManagement';
import StudentManagement from './pages/admin/StudentManagement'; // New
import AuditLogs from './pages/admin/AuditLogs';
import AdminProfile from './pages/admin/AdminProfile';
import AdminLayout from './layouts/AdminLayout'; // Fixed missing import
import CreateCompany from './pages/admin/CreateCompany'; // Keep for now or delete?
import CreateJob from './pages/admin/CreateJob'; // Keep for now or delete?
import StudentDashboard from './pages/student/StudentDashboard';
import JobDetails from './pages/student/JobDetails';
import MyApplications from './pages/student/MyApplications';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import JobApplications from './pages/recruiter/JobApplications';
import StudentProfile from './pages/student/StudentProfile';
import Footer from './components/Footer';
import StudentLayout from './layouts/StudentLayout'; // Added

import { NotificationProvider } from './context/NotificationContext';
import Notifications from './pages/student/Notifications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="bg-background min-h-screen text-text-dark font-sans flex flex-col">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route element={<StudentLayout />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/jobs/:id" element={<JobDetails />} />
                    <Route path="/student/applications" element={<MyApplications />} />
                    <Route path="/student/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<StudentProfile />} />
                  </Route>
                </Route>

                {/* Admin Routes with Layout */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="companies" element={<CompanyManagement />} />
                    <Route path="companies/create" element={<CreateCompany />} />
                    <Route path="drives" element={<DriveManagement />} />
                    <Route path="jobs/create" element={<CreateJob />} />
                    <Route path="applications" element={<ApplicationManagement />} />
                    <Route path="students" element={<StudentManagement />} />
                    <Route path="logs" element={<AuditLogs />} />
                    <Route path="profile" element={<AdminProfile />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                  <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                  <Route path="/recruiter/jobs/:jobId/applications" element={<JobApplications />} />
                </Route>
              </Routes>
            </div>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
