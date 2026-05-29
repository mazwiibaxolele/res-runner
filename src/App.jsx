import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { RunnerApply } from './pages/RunnerApply';
import { Order } from './pages/Order';
import { Checkout } from './pages/Checkout';
import { Track } from './pages/Track';
import { Services } from './pages/Services';
import { RunnerDashboard } from './pages/RunnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Settings } from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { RunningAcrossScreen } from './components/ui/RunningAcrossScreen';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <div className="min-h-screen bg-brand-bg text-brand-text font-body selection:bg-brand-primary/30">
            <Navbar />
            
            <main>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/services" element={<Services />} />
                <Route path="/track" element={<Track />} />
                <Route path="/runner-apply" element={<RunnerApply />} />
                <Route path="/login" element={<Login />} />
                <Route path="/order" element={<Order />} />
                <Route path="/checkout/:orderId" element={<Checkout />} />
                <Route path="/runner-dashboard" element={<RunnerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            
            <RunningAcrossScreen />
            
            <Toaster 
              position="bottom-center"
              toastOptions={{
                className: 'clay-card !p-4 !rounded-[16px] !font-body',
                style: {
                  background: '#fff',
                  color: '#0F172A',
                  border: '4px solid #fff',
                },
              }} 
            />
          </div>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
