import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import toast from 'react-hot-toast';
import { 
  isFirebaseEnabled, 
  auth, 
  db 
} from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';

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

  const [loading, setLoading] = useState(isFirebaseEnabled);

  // Sync users list locally (when Firebase is disabled)
  useEffect(() => {
    if (!isFirebaseEnabled) {
      localStorage.setItem('rr_users', JSON.stringify(users));
    }
  }, [users]);

  // Sync current user locally (when Firebase is disabled)
  useEffect(() => {
    if (!isFirebaseEnabled) {
      if (user) {
        localStorage.setItem('rr_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('rr_current_user');
      }
    }
  }, [user]);

  // Sync applications locally (when Firebase is disabled)
  useEffect(() => {
    if (!isFirebaseEnabled) {
      localStorage.setItem('rr_runner_apps', JSON.stringify(runnerApplications));
    }
  }, [runnerApplications]);

  // Firebase Real-time listeners for users, applications, and auth state
  useEffect(() => {
    if (!isFirebaseEnabled) return;

    // Listen to Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() });
        } else {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            role: 'customer'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen to all users in Firestore to sync users list
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = [];
      snapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    });

    // Listen to runner applications in Firestore
    const unsubscribeApps = onSnapshot(collection(db, 'runner_applications'), (snapshot) => {
      const appsList = [];
      snapshot.forEach((doc) => {
        appsList.push({ id: doc.id, ...doc.data() });
      });
      setRunnerApplications(appsList);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
      unsubscribeApps();
    };
  }, []);

  const login = async (email, password, demoRole = null) => {
    if (isFirebaseEnabled) {
      try {
        let finalEmail = email;
        let finalPassword = password || 'password123';

        if (demoRole) {
          const roleEmails = {
            admin: 'admin@resrunner.co.za',
            runner: 'runner@resrunner.co.za',
            customer: 'customer@resrunner.co.za'
          };
          finalEmail = roleEmails[demoRole];
          finalPassword = 'password123';
        }

        let credentials;
        try {
          credentials = await signInWithEmailAndPassword(auth, finalEmail, finalPassword);
        } catch (signInError) {
          // If the demo user doesn't exist yet, auto-create it
          if (demoRole && (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/invalid-email')) {
            console.log(`Auto-creating demo user for ${demoRole} in Firebase...`);
            credentials = await createUserWithEmailAndPassword(auth, finalEmail, finalPassword);
            
            const demoNames = {
              admin: 'Admin User',
              runner: 'Runner User',
              customer: 'Customer User'
            };
            const demoProfile = {
              role: demoRole,
              name: demoNames[demoRole],
              email: finalEmail,
              createdAt: new Date().toISOString()
            };
            
            if (demoRole === 'runner') {
              demoProfile.status = 'online';
              demoProfile.residence = 'Sunnyside Halls';
              demoProfile.studentNumber = '1234567';
            }
            
            await setDoc(doc(db, 'users', credentials.user.uid), demoProfile);
          } else {
            throw signInError;
          }
        }

        const userDoc = await getDoc(doc(db, 'users', credentials.user.uid));
        if (userDoc.exists()) {
          const userData = { id: credentials.user.uid, ...userDoc.data() };
          setUser(userData);
          toast.success(`Logged in as ${userData.name}`);
        } else {
          toast.success(`Logged in successfully!`);
        }
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Login failed.');
        return false;
      }
    } else {
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
        setUser(foundUser);
        toast.success(`Logged in as ${foundUser.name}`);
        return true;
      } else {
        toast.error('User not found. Try demo login or register.');
        return false;
      }
    }
  };

  const registerCustomer = async (name, email, password) => {
    if (isFirebaseEnabled) {
      try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const newCustomer = {
          role: 'customer',
          name,
          email,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', credentials.user.uid), newCustomer);
        setUser({ id: credentials.user.uid, ...newCustomer });
        toast.success('Registration successful!');
        return true;
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Registration failed.');
        return false;
      }
    } else {
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
    }
  };

  const logout = async () => {
    if (isFirebaseEnabled) {
      try {
        await signOut(auth);
        setUser(null);
        toast.success('Logged out successfully');
      } catch (err) {
        console.error(err);
        toast.error('Logout failed.');
      }
    } else {
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const applyAsRunner = async (details) => {
    const appId = 'app_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const newApp = {
      id: appId,
      ...details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, 'runner_applications', appId), newApp);
        toast.success('Application submitted successfully!');
        return newApp;
      } catch (err) {
        console.error(err);
        toast.error('Failed to submit application to cloud.');
        return null;
      }
    } else {
      setRunnerApplications(prev => [newApp, ...prev]);
      toast.success('Application submitted successfully!');
      return newApp;
    }
  };

  const approveRunner = async (appId) => {
    const appData = runnerApplications.find(a => a.id === appId);
    if (!appData) return;

    if (users.find(u => u.email === appData.email)) {
      toast.error('User with this email already exists');
      return;
    }

    if (isFirebaseEnabled) {
      try {
        const runnerUserId = 'runner_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        const newRunner = {
          role: 'runner',
          name: appData.name,
          email: appData.email,
          status: 'online',
          residence: appData.residence,
          studentNumber: appData.studentNumber,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', runnerUserId), newRunner);
        await updateDoc(doc(db, 'runner_applications', appId), { status: 'approved' });

        toast.success(`Approved ${appData.name} as a Runner!`);
      } catch (err) {
        console.error(err);
        toast.error('Failed to approve runner in cloud.');
      }
    } else {
      const newRunner = {
        id: 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        role: 'runner',
        name: appData.name,
        email: appData.email,
        password: 'password',
        status: 'online',
        residence: appData.residence,
        studentNumber: appData.studentNumber
      };

      setUsers(prev => [...prev, newRunner]);
      setRunnerApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
      toast.success(`Approved ${appData.name} as a Runner!`);
    }
  };

  const rejectRunner = async (appId) => {
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'runner_applications', appId), { status: 'rejected' });
        toast.success('Runner application rejected');
      } catch (err) {
        console.error(err);
        toast.error('Failed to reject runner in cloud.');
      }
    } else {
      setRunnerApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
      toast.success('Runner application rejected');
    }
  };

  const toggleRunnerStatus = async (runnerId, status) => {
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'users', runnerId), { status });
        if (user && user.id === runnerId) {
          setUser(prev => ({ ...prev, status }));
        }
        toast.success(`Status set to ${status}`);
      } catch (err) {
        console.error(err);
        toast.error('Failed to toggle status in cloud.');
      }
    } else {
      setUsers(prev => prev.map(u => u.id === runnerId ? { ...u, status } : u));
      if (user && user.id === runnerId) {
        setUser(prev => ({ ...prev, status }));
      }
      toast.success(`Status set to ${status}`);
    }
  };

  const updateUserProfile = async (userId, data) => {
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'users', userId), data);
        if (user && user.id === userId) {
          setUser(prev => ({ ...prev, ...data }));
        }
        toast.success('Profile updated successfully');
        return true;
      } catch (err) {
        console.error(err);
        toast.error('Failed to update profile.');
        return false;
      }
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      if (user && user.id === userId) {
        setUser(prev => ({ ...prev, ...data }));
      }
      toast.success('Profile updated locally');
      return true;
    }
  };

  const deleteAccount = async () => {
    if (isFirebaseEnabled && auth.currentUser) {
      try {
        const uid = auth.currentUser.uid;
        // Delete Firestore document first
        await deleteDoc(doc(db, 'users', uid));
        // Delete Auth user
        await deleteUser(auth.currentUser);
        setUser(null);
        toast.success('Account permanently deleted');
        return true;
      } catch (err) {
        console.error(err);
        if (err.code === 'auth/requires-recent-login') {
          toast.error('Please log out and log back in to delete your account for security reasons.');
        } else {
          toast.error('Failed to delete account.');
        }
        return false;
      }
    } else if (!isFirebaseEnabled) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setUser(null);
      toast.success('Account permanently deleted (local)');
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, users, login, logout, registerCustomer, loading,
      runnerApplications, applyAsRunner, approveRunner, rejectRunner, toggleRunnerStatus,
      updateUserProfile, deleteAccount
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
