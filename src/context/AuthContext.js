import React, { createContext, useContext, useMemo, useState } from 'react';

export const USER_PROFILES = {
  admin: {
    id: 'admin-1',
    name: 'Principal Sharma',
    role: 'admin',
    roleTitle: 'School Administrator',
    email: 'admin@saferide.edu',
    phone: '+91 98765 43210',
    avatar: '👨‍💼',
    campus: 'Greenwood International Campus',
  },
  driver: {
    id: 'driver-1',
    name: 'Rajesh Kumar',
    role: 'driver',
    roleTitle: 'Fleet Pilot / Escort',
    email: 'driver.rajesh@saferide.edu',
    phone: '+91 98123 45678',
    avatar: '👨‍✈️',
    busId: 'bus-1',
    busNumber: 'KA-04-E-1001 (Bus #101)',
  },
  parent: {
    id: 'parent-1',
    name: 'Priya Nair',
    role: 'parent',
    roleTitle: 'Guardian / Parent',
    email: 'priya.nair@example.com',
    phone: '+91 99887 76655',
    avatar: '👩',
    childId: 'stud-1',
    childName: 'Aarav Nair',
    childGrade: 'Grade 5-B',
    busId: 'bus-1',
  },
  student: {
    id: 'stud-1',
    name: 'Aarav Nair',
    role: 'student',
    roleTitle: 'Enrolled Student',
    email: 'aarav.nair@saferide.edu',
    phone: '+91 99887 76655',
    avatar: '🎒',
    grade: 'Grade 5-B',
    rollNo: '24',
    busId: 'bus-1',
    busNumber: 'Bus #101',
    stopName: 'Maple Grove Ave',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentRoleKey, setCurrentRoleKey] = useState('admin');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const user = USER_PROFILES[currentRoleKey] || USER_PROFILES.admin;

  const value = useMemo(
    () => ({
      user,
      currentRoleKey,
      isAuthenticated,
      profiles: USER_PROFILES,
      loginAs: (roleKey) => {
        if (USER_PROFILES[roleKey]) {
          setCurrentRoleKey(roleKey);
          setIsAuthenticated(true);
        }
      },
      switchRole: (roleKey) => {
        if (USER_PROFILES[roleKey]) {
          setCurrentRoleKey(roleKey);
        }
      },
      logout: () => setIsAuthenticated(false),
    }),
    [user, currentRoleKey, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

