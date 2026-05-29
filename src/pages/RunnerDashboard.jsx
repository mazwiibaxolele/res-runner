import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { ChatBox } from '../components/chat/ChatBox';
import { 
  Bike, TrendingUp, Sparkles, AlertCircle, CheckCircle, 
  MapPin, ShoppingCart, User, Phone, ShieldAlert, MessageCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function RunnerDashboard() {
  const { user, toggleRunnerStatus } = useAuth();
  const { orders, updateOrderStatus } = useOrder();
  const [showChat, setShowChat] = useState(false);

  // Route security check (admin can also access to fulfill orders)
  if (!user || (user.role !== 'runner' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4 flex items-center justify-center">
        <ClayCard className="max-w-md w-full text-center space-y-4">
          <ShieldAlert size={48} className="mx-auto text-red-500 animate-bounce" />
          <h2 className="text-2xl font-bold text-brand-text">Runner Access Denied</h2>
          <p className="text-brand-muted">You must be logged in as an approved runner to view this portal.</p>
          <Link to="/login">
            <ClayButton>Log In</ClayButton>
          </Link>
        </ClayCard>
      </div>
    );
  }

  const isOnline = user.status === 'online';

  // Active errand for this runner
  const activeErrand = orders.find(o => ['assigned', 'in_progress'].includes(o.status) && o.runnerId === user.id);

  // Completed errands by this runner
  const completedErrands = orders.filter(o => o.status === 'delivered' && o.runnerId === user.id);

  // Earnings calculations (Runner receives 70% cut from service fee)
  const totalEarnings = completedErrands.reduce((sum, o) => {
    return sum + (o.pricing?.runnerCut || 0);
  }, 0);

  const handleStatusTransition = () => {
    if (!activeErrand) return;
    if (activeErrand.status === 'assigned') {
      updateOrderStatus(activeErrand.id, 'in_progress');
    } else if (activeErrand.status === 'in_progress') {
      updateOrderStatus(activeErrand.id, 'delivered');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/10 rounded-full border-2 border-white shadow-clay-btn text-brand-primary">
              <Bike size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-brand-text">Runner Hub</h1>
              <p className="text-brand-muted">Manage your errands, status, and earnings.</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 bg-white p-3 border-4 border-white shadow-clay-card rounded-[24px]">
            <span className="font-heading font-bold text-sm text-brand-text">
              Availability: <span className={isOnline ? 'text-brand-primary' : 'text-brand-muted'}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </span>
            <button
              onClick={() => toggleRunnerStatus(user.id, isOnline ? 'offline' : 'online')}
              className={`w-14 h-8 rounded-full transition-all relative border-2 ${
                isOnline ? 'bg-brand-primary border-green-600' : 'bg-slate-200 border-slate-300'
              }`}
            >
              <div 
                className={`absolute w-6 h-6 rounded-full bg-white top-0.5 shadow transition-all ${
                  isOnline ? 'right-0.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ClayCard className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-bold">Earnings (ZAR)</p>
              <p className="text-3xl font-bold font-heading text-brand-primary mt-1">R{totalEarnings.toFixed(2)}</p>
            </div>
            <div className="p-2.5 bg-brand-secondary/20 rounded-xl text-brand-primary">
              <TrendingUp size={24} />
            </div>
          </ClayCard>

          <ClayCard className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-bold">Errands Completed</p>
              <p className="text-3xl font-bold font-heading text-brand-text mt-1">{completedErrands.length}</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <CheckCircle size={24} />
            </div>
          </ClayCard>

          <ClayCard className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted font-bold">Wits Braam District</p>
              <p className="text-lg font-bold font-heading text-yellow-700 mt-1 flex items-center gap-1">
                <Sparkles size={16} className="animate-spin text-brand-accent" /> High Demand
              </p>
            </div>
            <div className="p-2.5 bg-yellow-50 rounded-xl text-yellow-600">
              <AlertCircle size={24} />
            </div>
          </ClayCard>
        </div>

        {/* Errands Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Active Errand Column */}
          <div className="lg:col-span-2 space-y-6">
            <ClayCard className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-3">Active Dispatch Errand</h2>

              {!isOnline ? (
                <div className="text-center py-8 text-brand-muted space-y-2">
                  <p>You are currently offline.</p>
                  <p className="text-xs">Turn on availability in the header to start accepting errands.</p>
                </div>
              ) : !activeErrand ? (
                <div className="text-center py-8 text-brand-muted space-y-2">
                  <p>No errands assigned yet.</p>
                  <p className="text-xs">Incoming errands will appear here once verified by an Admin.</p>
                </div>
              ) : (
                <div className="space-y-6 relative">
                  {/* Status Indicator */}
                  <div className="bg-brand-bg p-4 rounded-[16px] border-2 border-white flex justify-between items-center text-sm shadow-inner">
                    <div>
                      <span className="text-xs text-brand-muted font-semibold">Status</span>
                      <p className="font-bold text-brand-primary capitalize text-base">
                        {activeErrand.status.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <ClayButton onClick={handleStatusTransition}>
                      {activeErrand.status === 'assigned' ? 'Start Fetching' : 'Mark Delivered'}
                    </ClayButton>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-brand-bg/50 p-4 border-2 border-white rounded-[20px] space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-brand-text flex items-center gap-1.5">
                          <User size={16} className="text-brand-primary" /> Customer Info
                        </p>
                        <button 
                          onClick={() => setShowChat(true)}
                          className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary font-bold px-2 py-1 rounded-full text-[10px] hover:bg-brand-primary hover:text-white transition-colors"
                        >
                          <MessageCircle size={12} /> Chat
                        </button>
                      </div>
                      <p className="text-brand-muted">Name: <span className="font-semibold text-brand-text">{activeErrand.customerName}</span></p>
                      <p className="text-brand-muted">Email: <span className="font-semibold text-brand-text">{activeErrand.customerEmail}</span></p>
                      <p className="text-brand-muted flex items-center gap-1">
                        <Phone size={12} /> Contact: <span className="font-semibold text-brand-text">082 123 4567</span>
                      </p>
                    </div>

                    <div className="bg-brand-bg/50 p-4 border-2 border-white rounded-[20px] space-y-2 text-sm">
                      <p className="font-bold text-brand-text flex items-center gap-1.5">
                        <MapPin size={16} className="text-brand-primary" /> Delivery Res
                      </p>
                      <p className="text-brand-muted font-semibold text-brand-text text-base">{activeErrand.residence}</p>
                      <p className="text-[11px] text-brand-primary font-bold mt-1 bg-brand-primary/10 px-2 py-1 rounded-full inline-block">
                        Earnings: R{activeErrand.pricing?.runnerCut?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Shopping List */}
                  <div className="bg-brand-bg/30 p-5 rounded-[20px] border-2 border-white space-y-3">
                    <h3 className="font-heading font-bold text-sm text-brand-text flex items-center gap-1.5">
                      <ShoppingCart size={16} className="text-brand-primary" /> Shopping Checklist
                    </h3>
                    
                    <div className="divide-y divide-slate-100">
                      {activeErrand.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2 text-sm text-brand-text font-semibold">
                          <span>{item.quantity} x {item.name}</span>
                          <span className="text-brand-muted">Est: R{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </ClayCard>
          </div>

          {/* History Column */}
          <div>
            <ClayCard className="space-y-4">
              <h2 className="text-lg font-bold border-b pb-3">Completed Errands</h2>
              {completedErrands.length === 0 ? (
                <p className="text-xs text-brand-muted py-4 text-center">
                  No completed errands yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {completedErrands.map(order => (
                    <div key={order.id} className="p-3 bg-brand-bg/50 border rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-brand-text">{order.id}</span>
                        <span className="text-brand-primary">R{order.pricing?.runnerCut?.toFixed(2)}</span>
                      </div>
                      <p className="text-brand-muted">To: {order.residence}</p>
                      <p className="text-[10px] text-brand-muted/75">
                        Delivered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ClayCard>
          </div>
        </div>

        {/* Global ChatBox Mount */}
        {showChat && activeErrand && (
          <ChatBox 
            orderId={activeErrand.id} 
            onClose={() => setShowChat(false)} 
            recipientName={activeErrand.customerName}
          />
        )}
      </div>
    </div>
  );
}
