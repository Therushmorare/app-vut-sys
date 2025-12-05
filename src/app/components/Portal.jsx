"use client"

import { useState } from 'react';
import { Home, FileText, User, Bell } from 'lucide-react';
import { COLORS } from '../constants/colors';
import Header from './Header';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Dashboard/Profile';
import Login from './auth/Login';
import Registration from './auth/Registration';
import DocumentUpload from './Documents';
import Notifications from './Notifications';

export default function StudentPortal() {
  const [view, setView] = useState('login');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleRegister = (formData) => {
    const newStudent = {
      id: `STU${String(registeredUsers.length + 1).padStart(3, '0')}`,
      studentNumber: `2025${String(registeredUsers.length + 1).padStart(4, '0')}`,
      ...formData,
      status: 'Pending',
      registrationDate: new Date().toISOString(),
      documentsComplete: false,
      setaAllocation: null,
      placement: null,
      notifications: []
    };
    
    setRegisteredUsers([...registeredUsers, newStudent]);
    setCurrentStudent(newStudent);
    setView('portal');
  };

  const handleLogin = (formData) => {
    const user = registeredUsers.find(u => u.email === formData.email);
    
    if (user) {
      setCurrentStudent(user);
      setView('portal');
    } else {
      alert('Invalid credentials. Please register first.');
    }
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setView('login');
    setActiveView('dashboard');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  if (view === 'register') {
    return <Registration onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
  }

  if (view === 'login') {
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bgLight }}>
      <Header student={currentStudent} onLogout={handleLogout} onNavigate={setActiveView} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeView === item.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{ backgroundColor: activeView === item.id ? COLORS.primary : COLORS.bgWhite }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {activeView === 'dashboard' && <Dashboard student={currentStudent} onNavigate={setActiveView} />}
          {activeView === 'profile' && <Profile student={currentStudent} />}
          {activeView === 'documents' && (
            <div className="rounded-lg p-8 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
              <DocumentUpload student={currentStudent} />
            </div>
          )}
          {activeView === 'notifications' && (
            <div className="rounded-lg p-8 shadow-sm text-center" style={{ backgroundColor: COLORS.bgWhite }}>
              <Notifications student={currentStudent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}