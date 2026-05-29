import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { 
  Shield, Check, X, FileText, UserCheck, 
  CreditCard, ClipboardList, ShieldAlert, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { user, runnerApplications, approveRunner, rejectRunner, users } = useAuth();
  const { orders, updateOrderStatus } = useOrder();
  const [selectedRunners, setSelectedRunners] = React.useState({});

  // Route security check
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4 flex items-center justify-center">
        <ClayCard className="max-w-md w-full text-center space-y-4">
          <ShieldAlert size={48} className="mx-auto text-red-500 animate-bounce" />
          <h2 className="text-2xl font-bold text-brand-text">Admin Access Denied</h2>
          <p className="text-brand-muted">You must be logged in as an administrator to view this portal.</p>
          <Link to="/login">
            <ClayButton>Log In</ClayButton>
          </Link>
        </ClayCard>
      </div>
    );
  }

  // Filter orders needing payment approval (pending_runner status)
  const pendingPaymentOrders = orders.filter(o => o.status === 'pending_runner');
  
  // Filter other active orders
  const activeOrders = orders.filter(o => ['assigned', 'in_progress'].includes(o.status));

  // Filter pending runner applications
  const pendingRunnerApps = runnerApplications.filter(app => app.status === 'pending');

  // Filter all approved runners in system
  const approvedRunners = users.filter(u => u.role === 'runner');

  const handleApprovePayment = (orderId) => {
    const runnerId = selectedRunners[orderId];
    if (!runnerId) {
      alert('Please select a runner to delegate to, or claim it yourself.');
      return;
    }
    const isSelfClaim = runnerId === 'admin_claim';
    const assignedRunnerName = isSelfClaim ? user.name : approvedRunners.find(r => r.id === runnerId)?.name;
    
    updateOrderStatus(orderId, 'assigned', {
      runnerId: isSelfClaim ? user.id : runnerId,
      runnerName: assignedRunnerName
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-primary/10 rounded-full border-2 border-white shadow-clay-btn text-brand-primary">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-brand-text">Admin Control Dashboard</h1>
            <p className="text-brand-muted">Verify transactions, approve runners, and monitor orders.</p>
          </div>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* EFT Verification Panel */}
          <div className="lg:col-span-2 space-y-6">
            <ClayCard className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <CreditCard className="text-brand-primary" size={20} />
                <h2 className="text-xl font-bold">EFT Verification Queue ({pendingPaymentOrders.length})</h2>
              </div>

              {pendingPaymentOrders.length === 0 ? (
                <p className="text-brand-muted text-sm py-6 text-center">
                  No pending EFT proof uploads at this time.
                </p>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {pendingPaymentOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="p-4 bg-brand-bg/50 border-2 border-white rounded-[20px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-text">{order.id}</span>
                          <span className="text-xs bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded-full">
                            R{order.pricing.total.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted">
                          Customer: <span className="font-semibold text-brand-text">{order.customerName}</span> | Res: <span className="font-semibold text-brand-text">{order.residence}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-xs pt-1">
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-semibold truncate max-w-[150px]">
                            Check WhatsApp for POP
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <select 
                          className="clay-input !py-1.5 !px-2 text-xs cursor-pointer"
                          value={selectedRunners[order.id] || ''}
                          onChange={(e) => setSelectedRunners(prev => ({ ...prev, [order.id]: e.target.value }))}
                        >
                          <option value="" disabled>Select Runner...</option>
                          <option value="admin_claim" className="font-bold text-brand-primary">🙋‍♂️ Claim as Admin</option>
                          {approvedRunners.map(r => (
                            <option key={r.id} value={r.id}>🏃 {r.name} ({r.status || 'offline'})</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleApprovePayment(order.id)}
                          className="flex-1 md:flex-none py-2 px-4 bg-brand-primary text-white border-b-4 border-green-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all active:translate-y-1 active:border-b-0"
                        >
                          <Check size={14} /> Verify & Dispatch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ClayCard>

            {/* Active Orders Queue */}
            <ClayCard className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <ClipboardList className="text-brand-primary" size={20} />
                <h2 className="text-xl font-bold">Active Campus Errands ({activeOrders.length})</h2>
              </div>

              {activeOrders.length === 0 ? (
                <p className="text-brand-muted text-sm py-6 text-center">
                  No active runner errands currently running.
                </p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {activeOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="p-4 bg-brand-bg/50 border-2 border-white rounded-[20px] shadow-sm flex justify-between items-center text-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-text">{order.id}</span>
                          <span className="text-xs capitalize font-bold text-brand-primary px-2 py-0.5 bg-brand-secondary/20 rounded-full">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted mt-1">
                          Delivery to: <span className="font-semibold text-brand-text">{order.residence}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-brand-muted block">Runner</span>
                        <span className="font-bold text-brand-text">{order.runnerName || 'Pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ClayCard>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            
            {/* Runner Verification Queue */}
            <ClayCard className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <UserCheck className="text-brand-primary" size={20} />
                <h2 className="text-lg font-bold">Runner Applications ({pendingRunnerApps.length})</h2>
              </div>

              {pendingRunnerApps.length === 0 ? (
                <p className="text-brand-muted text-xs py-4 text-center">
                  No pending student applications.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingRunnerApps.map(app => (
                    <div 
                      key={app.id} 
                      className="p-3 bg-brand-bg/60 border-2 border-white rounded-[16px] text-xs space-y-3"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-brand-text text-sm">{app.name}</p>
                        <p className="text-brand-muted">Email: {app.email}</p>
                        <p className="text-brand-muted">Student No: {app.studentNumber}</p>
                        <p className="text-brand-muted">Res: {app.residence}</p>
                        <p className="text-brand-muted italic mt-1 bg-white p-2 rounded border">
                          "{app.motivation}"
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveRunner(app.id)}
                          className="flex-1 py-1.5 bg-brand-primary text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          onClick={() => rejectRunner(app.id)}
                          className="flex-1 py-1.5 bg-red-500 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1"
                        >
                          <X size={12} /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ClayCard>

            {/* Approved Runners Status List */}
            <ClayCard className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <Award className="text-brand-primary" size={20} />
                <h2 className="text-lg font-bold">System Runners ({approvedRunners.length})</h2>
              </div>

              <div className="space-y-2">
                {approvedRunners.map(runner => (
                  <div key={runner.id} className="flex justify-between items-center text-xs p-2.5 bg-brand-bg/30 border rounded-lg">
                    <span className="font-bold text-brand-text">{runner.name}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      runner.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {runner.status || 'offline'}
                    </span>
                  </div>
                ))}
              </div>
            </ClayCard>

          </div>
        </div>

      </div>
    </div>
  );
}
