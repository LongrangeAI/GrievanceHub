// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import NewGrievanceForm from './pages/NewGrievanceForm/NewgrievanceForm';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import GrievanceStatus from './pages/GrievanceStatus/GrievanceStatus';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminGrievanceList from './pages/Admin/AdminGrievanceList';
import AdminGrievanceDetail from './pages/Admin/AdminGrievanceDetail';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminReports from './pages/Admin/AdminReports';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import UserProfile from './pages/UserProfile/UserProfile';
import UserSettings from "./pages/UserSettings/UserSettings";
import About from "./pages/About/About";
import DepartmentGrievances from "./pages/Admin/DepartmentGrievances";
import Contact from "./pages/Contact/Contact";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/grievance-form" element={<NewGrievanceForm />} />
        <Route path="/grievance-status" element={<GrievanceStatus />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/grievances" element={<AdminGrievanceList />} />
        <Route path="/admin/grievance/:id" element={<AdminGrievanceDetail />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/department/:deptName" element={<DepartmentGrievances />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
