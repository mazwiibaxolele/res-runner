import React, { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { ChatBox } from '../components/chat/ChatBox';
import { 
  Package, MapPin, CheckCircle, RefreshCw, 
  HelpCircle, CreditCard, Clock, UserCheck, ShieldAlert 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const runnerIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #16A34A; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">🏃</div>`
});

const resIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #EF4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">📍</div>`
});

const statusConfig = {
  pending_eft: {
    label: 'Awaiting EFT Proof',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Please upload your proof of payment so we can start processing.',
    step: 1
  },
  pending_runner: {
    label: 'Verifying Payment',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'We are verifying your EFT payment and matching a runner.',
    step: 2
  },
  assigned: {
    label: 'Runner Assigned',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'A runner has accepted your errand and is heading to the shop.',
    step: 3
  },
  in_progress: {
    label: 'In Transit',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Your runner is on their way to deliver the items to your res.',
    step: 4
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Errand complete. Thank you for using Res Runner!',
    step: 5
  }
};

export function Track() {
  const { user } = useAuth();
  const { orders } = useOrder();
  const [activeChatOrderId, setActiveChatOrderId] = useState(null);
  const [customerLocation, setCustomerLocation] = useState([-26.1912, 28.0305]); // Braamfontein default

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Geolocation denied/failed. Using defaults.", error);
        }
      );
    }
  }, []);

  // Filter orders matching the logged in customer
  const customerOrders = orders.filter(
    o => o.customerEmail === (user ? user.email : '')
  );

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4 flex items-center justify-center">
        <ClayCard className="max-w-md w-full text-center space-y-4">
          <ShieldAlert size={48} className="mx-auto text-yellow-600 animate-bounce" />
          <h2 className="text-2xl font-bold">Please Log In</h2>
          <p className="text-brand-muted">You must be logged in to view and track your orders.</p>
          <Link to="/login">
            <ClayButton>Log In</ClayButton>
          </Link>
        </ClayCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-brand-text">Track Your Orders</h1>
            <p className="text-brand-muted">Monitor active runner dispatches in Braamfontein.</p>
          </div>
          <Link to="/order">
            <ClayButton className="py-2.5 px-5 text-sm">New Order</ClayButton>
          </Link>
        </div>

        {customerOrders.length === 0 ? (
          <ClayCard className="text-center py-12 space-y-4">
            <Package className="mx-auto text-slate-300 stroke-[1.5]" size={64} />
            <h2 className="text-2xl font-bold text-brand-text">No Orders Placed Yet</h2>
            <p className="text-brand-muted max-w-sm mx-auto">
              You haven't ordered anything yet. Head to the order section to schedule your first run!
            </p>
            <Link to="/order" className="inline-block pt-2">
              <ClayButton>Order Something Now</ClayButton>
            </Link>
          </ClayCard>
        ) : (
          <div className="space-y-6">
            {customerOrders.map(order => {
              const status = statusConfig[order.status] || {
                label: 'Unknown',
                color: 'bg-gray-100 text-gray-800 border-gray-300',
                description: 'Order status is being updated.',
                step: 0
              };

              return (
                <ClayCard key={order.id} className="space-y-6 border-l-[12px] border-l-brand-primary relative">
                  {/* Order Details Header */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-bold text-xl text-brand-text">{order.id}</h3>
                        <span className={`text-xs font-bold border-2 py-0.5 px-3 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-brand-muted text-xs mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-brand-muted font-semibold">Total Cost</p>
                      <p className="text-xl font-bold text-brand-primary font-heading">
                        R{order.pricing.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order tracking step bar */}
                  <div className="space-y-4">
                    <div className="relative pt-4">
                      {/* Grey background line */}
                      <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-200 -translate-y-1/2 rounded-full"></div>
                      {/* Active green indicator line */}
                      <div 
                        className="absolute top-1/2 left-0 h-2 bg-brand-primary -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${((status.step - 1) / 4) * 100}%` }}
                      ></div>

                      {/* Circles for steps */}
                      <div className="relative flex justify-between">
                        {[1, 2, 3, 4, 5].map((stepNum) => {
                          const isActive = stepNum <= status.step;
                          const isCurrent = stepNum === status.step;
                          return (
                            <div 
                              key={stepNum} 
                              className={`w-8 h-8 rounded-full border-4 flex items-center justify-center font-heading font-bold text-xs transition-all ${
                                isCurrent 
                                  ? 'bg-white border-brand-primary text-brand-primary scale-110 shadow-clay-btn' 
                                  : isActive 
                                    ? 'bg-brand-primary border-brand-primary text-white' 
                                    : 'bg-white border-slate-200 text-slate-400'
                              }`}
                            >
                              {stepNum}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-sm bg-brand-bg p-4 rounded-[16px] border-2 border-white shadow-inner space-y-1">
                      <p className="font-bold text-brand-text flex items-center gap-1.5">
                        <Clock size={16} className="text-brand-primary" /> Current Status
                      </p>
                      <p className="text-brand-muted">{status.description}</p>
                      
                      {order.status === 'pending_eft' && (
                        <div className="pt-2">
                          <Link to={`/checkout/${order.id}`}>
                            <ClayButton className="!py-2 !px-4 text-xs font-semibold">
                              Go to Checkout & Upload POP
                            </ClayButton>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Runner & Map Block (Only when assigned or in_progress) */}
                  {(order.status === 'assigned' || order.status === 'in_progress') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Runner Details & Chat */}
                      <div className="bg-brand-bg/50 p-4 border-2 border-white rounded-[20px] flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-brand-primary text-white font-heading font-bold text-lg flex items-center justify-center border-2 border-white shadow-clay-btn shrink-0">
                            🏃‍♂️
                          </div>
                          <div>
                            <p className="text-xs text-brand-muted font-bold">Assigned Runner</p>
                            <p className="font-bold text-brand-text">{order.runnerName || 'Verified Runner'}</p>
                            <span className="text-[11px] bg-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded-full font-semibold inline-block mt-0.5">
                              Verified
                            </span>
                          </div>
                        </div>
                        <ClayButton 
                          className="!py-2 text-sm flex gap-2 justify-center" 
                          variant="secondary"
                          onClick={() => setActiveChatOrderId(order.id)}
                        >
                          <HelpCircle size={16} /> Chat with Runner
                        </ClayButton>
                      </div>

                      {/* Real Interactive GPS Map using Leaflet */}
                      <div className="clay-card relative h-[180px] bg-slate-100 overflow-hidden flex flex-col justify-end p-0 border-2 rounded-[20px] z-0">
                        <MapContainer 
                          key={customerLocation.join(',')}
                          center={customerLocation} 
                          zoom={14} 
                          scrollWheelZoom={false}
                          style={{ height: '100%', width: '100%', zIndex: 1 }}
                        >
                          <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={customerLocation} icon={resIcon}>
                            <Popup>Your Location</Popup>
                          </Marker>
                          <Marker position={[customerLocation[0] + 0.003, customerLocation[1] - 0.005]} icon={runnerIcon}>
                            <Popup>Runner Location (Est)</Popup>
                          </Marker>
                        </MapContainer>
                        <span className="absolute top-2 left-2 z-[400] text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full text-brand-muted shadow-sm flex items-center gap-1">
                          <RefreshCw size={10} className="animate-spin text-brand-primary" /> Live tracking...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Order Items Info */}
                  <div className="bg-brand-bg/30 p-4 border-2 border-white rounded-[20px] text-sm">
                    <p className="font-bold text-brand-text mb-2 flex items-center gap-1.5">
                      Items Ordered
                    </p>
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1.5 text-xs text-brand-muted">
                          <span>{item.quantity} x {item.name}</span>
                          <span className="font-bold text-brand-text">R{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2.5 mt-2 border-t flex justify-between text-xs text-brand-muted">
                      <span>Delivery Location</span>
                      <span className="font-bold text-brand-text">{order.residence}</span>
                    </div>
                  </div>

                </ClayCard>
              );
            })}
          </div>
        )}

        {/* Global ChatBox Mount */}
        {activeChatOrderId && (
          <ChatBox 
            orderId={activeChatOrderId} 
            onClose={() => setActiveChatOrderId(null)} 
            recipientName="Runner"
          />
        )}

      </div>
    </div>
  );
}
