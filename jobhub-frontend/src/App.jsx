import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Public Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';

// User Pages
import DashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import ApplyPage from './pages/ApplyPage';

// Company Pages
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import CreateCompanyPage from './pages/company/CreateCompanyPage';
import CreateJobPage from './pages/company/CreateJobPage';
import ManageApplicantsPage from './pages/company/ManageApplicantsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['USER']}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs/:id/apply"
          element={
            <PrivateRoute roles={['USER']}>
              <ApplyPage />
            </PrivateRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="/company/dashboard"
          element={
            <PrivateRoute roles={['COMPANY']}>
              <CompanyDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/company/create"
          element={
            <PrivateRoute roles={['COMPANY']}>
              <CreateCompanyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/company/jobs/create"
          element={
            <PrivateRoute roles={['COMPANY']}>
              <CreateJobPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/company/jobs/:jobId/applicants"
          element={
            <PrivateRoute roles={['COMPANY']}>
              <ManageApplicantsPage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

