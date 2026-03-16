import { useState } from 'react';
import { LoginNew } from './components/LoginNew';
import { ForgotPassword } from './components/ForgotPassword';
import { StudentDashboardNew } from './components/StudentDashboardNew';
import { TeacherDashboardNew } from './components/TeacherDashboardNew';
import { AdminDashboardNew } from './components/AdminDashboardNew';
import { UserManagement } from './components/UserManagement';
import { RolePermissions } from './components/RolePermissions';

type UserRole = 'admin' | 'teacher' | 'student' | null;
type AppPage = 'login' | 'forgot-password' | 'dashboard' | 'user-management' | 'role-permissions';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentPage, setCurrentPage] = useState<AppPage>('login');

  const handleLogin = (role: 'admin' | 'teacher' | 'student') => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page: 'users' | 'permissions') => {
    if (page === 'users') {
      setCurrentPage('user-management');
    } else {
      setCurrentPage('role-permissions');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  // Forgot Password Page
  if (currentPage === 'forgot-password') {
    return <ForgotPassword onBack={() => setCurrentPage('login')} />;
  }

  // Login Page
  if (currentPage === 'login' || !userRole) {
    return (
      <LoginNew 
        onLogin={handleLogin} 
        onForgotPassword={() => setCurrentPage('forgot-password')} 
      />
    );
  }

  // User Management Page (Admin only)
  if (currentPage === 'user-management' && userRole === 'admin') {
    return (
      <UserManagement 
        onBack={handleBackToDashboard} 
        onLogout={handleLogout}
      />
    );
  }

  // Role Permissions Page (Admin only)
  if (currentPage === 'role-permissions' && userRole === 'admin') {
    return (
      <RolePermissions 
        onBack={handleBackToDashboard} 
        onLogout={handleLogout}
      />
    );
  }

  // Dashboards
  if (currentPage === 'dashboard') {
    if (userRole === 'admin') {
      return <AdminDashboardNew onLogout={handleLogout} onNavigate={handleNavigate} />;
    }

    if (userRole === 'teacher') {
      return <TeacherDashboardNew onLogout={handleLogout} />;
    }

    if (userRole === 'student') {
      return <StudentDashboardNew onLogout={handleLogout} />;
    }
  }

  return null;
}
