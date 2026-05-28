import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('rr_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rr_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [runnerApplications, setRunnerApplications] = useState(() => {
    const saved = localStorage.getItem('rr_runner_apps');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rr_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rr_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rr_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rr_runner_apps', JSON.stringify(runnerApplications));
  }, [runnerApplications]);

  const login = (email, password, demoRole = null) => {
    if (demoRole) {
      const foundUser = users.find(u => u.role === demoRole);
      if (foundUser) {
        setUser(foundUser);
        toast.success(`Logged in as ${foundUser.name} (${foundUser.role})`);
        return true;
      }
      return false;
    }

    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      // Allow any password or default to "password" for mock database ease of use
      setUser(foundUser);
      toast.success(`Logged in as ${foundUser.name}`);
      return true;
    } else {
      toast.error('User not found. Try demo login or register.');
      return false;
    }
  };

  const registerCustomer = (name, email, password) => {
    if (users.find(u => u.email === email)) {
      toast.error('Email already exists');
      return false;
    }

    const newCustomer = {
      id: 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      role: 'customer',
      name,
      email,
      password: password || 'password'
    };

    setUsers(prev => [...prev, newCustomer]);
    setUser(newCustomer);
    toast.success('Registration successful!');
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const applyAsRunner = (details) => {
    const newApp = {
      id: 'app_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      ...details,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString()
    };
    setRunnerApplications(prev => [newApp, ...prev]);
    toast.success('Application submitted successfully!');
    return newApp;
  };

  const approveRunner = (appId) => {
    const app = runnerApplications.find(a => a.id === appId);
    if (!app) return;

    if (users.find(u => u.email === app.email)) {
      toast.error('User with this email already exists');
      return;
    }

    const newRunner = {
      id: 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      role: 'runner',
      name: app.name,
      email: app.email,
      password: 'password',
      status: 'online',
      residence: app.residence,
      studentNumber: app.studentNumber
    };

    setUsers(prev => [...prev, newRunner]);
    setRunnerApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
    toast.success(`Approved ${app.name} as a Runner!`);
  };

  const rejectRunner = (appId) => {
    setRunnerApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
    toast.success('Runner application rejected');
  };

  const toggleRunnerStatus = (runnerId, status) => {
    setUsers(prev => prev.map(u => u.id === runnerId ? { ...u, status } : u));
    if (user && user.id === runnerId) {
      setUser(prev => ({ ...prev, status }));
    }
    toast.success(`Status set to ${status}`);
  };

  return (
    <AuthContext.Provider value={{ 
      user, users, login, logout, registerCustomer, 
      runnerApplications, applyAsRunner, approveRunner, rejectRunner, toggleRunnerStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
