import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateCompany from './pages/admin/CreateCompany';
import CreateJob from './pages/admin/CreateJob';
import StudentDashboard from './pages/student/StudentDashboard';
import JobDetails from './pages/student/JobDetails';
import MyApplications from './pages/student/MyApplications';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import JobApplications from './pages/recruiter/JobApplications';
import StudentProfile from './pages/student/StudentProfile';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-background min-h-screen text-text-dark font-sans">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Redirect root to login (or dashboard via Navbar logic impact?) 
                Actually, Navbar handles logo click. Root path should probably redirect to login or check auth. 
                Let's keep the existing redirect for now, or make a Home component.
                For now, redirect to login is safe.
            */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/jobs/:id" element={<JobDetails />} />
              <Route path="/student/applications" element={<MyApplications />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/companies/create" element={<CreateCompany />} />
              <Route path="/admin/jobs/create" element={<CreateJob />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs/:jobId/applications" element={<JobApplications />} />
            </Route>

            {/* Common Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<StudentProfile />} />
            </Route>

          </Routes>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
