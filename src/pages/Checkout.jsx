import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { Landmark, MessageCircle, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrder();
  const { users } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const order = orders.find(o => o.id === orderId);

  const handleSubmitPOP = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // The admin's WhatsApp number (make sure to include country code without '+')
    // TODO: You can update this to your actual phone number later
    const adminWhatsApp = "27612345678"; 
    
    const message = `Hi, here is my Proof of Payment for order *${order.id}*.\n\nDelivery to: ${order.residence}\nTotal: R${order.pricing.total.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Move order forward in our app
    setTimeout(() => {
      updateOrderStatus(orderId, 'pending_runner');
      setSubmitting(false);
      navigate('/track');
    }, 1000);
  };

  if (!order) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4 flex items-center justify-center">
        <ClayCard className="max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Order Not Found</h2>
          <p className="text-brand-muted">We couldn't find an active order with ID: {orderId}</p>
          <Link to="/order">
            <ClayButton>Place a New Order</ClayButton>
          </Link>
        </ClayCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link to="/order" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-text font-semibold">
          <ArrowLeft size={16} /> Back to ordering
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-brand-text">EFT Payment Confirmation</h1>
          <p className="text-brand-muted">Please complete your payment of <span className="font-bold text-brand-primary">R{order.pricing.total.toFixed(2)}</span> to dispatch your runner.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Bank Details */}
          <div className="md:col-span-3 space-y-6">
            <ClayCard className="space-y-4">
              <div className="flex items-center gap-3 text-brand-primary border-b pb-3">
                <Landmark size={24} />
                <h3 className="font-heading font-bold text-lg text-brand-text">Our Bank Details</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between bg-brand-bg/50 p-2.5 rounded-lg border">
                  <span className="text-brand-muted font-semibold">Bank Name:</span>
                  <span className="font-bold text-brand-text">First National Bank (FNB)</span>
                </div>
                <div className="flex justify-between bg-brand-bg/50 p-2.5 rounded-lg border">
                  <span className="text-brand-muted font-semibold">Account Number:</span>
                  <span className="font-mono font-bold text-brand-text">62912345678</span>
                </div>
                <div className="flex justify-between bg-brand-bg/50 p-2.5 rounded-lg border">
                  <span className="text-brand-muted font-semibold">Branch Code:</span>
                  <span className="font-mono font-bold text-brand-text">250655</span>
                </div>
                <div className="flex justify-between bg-brand-bg/50 p-2.5 rounded-lg border">
                  <span className="text-brand-muted font-semibold">Account Type:</span>
                  <span className="font-bold text-brand-text">Business Cheque</span>
                </div>
                <div className="flex justify-between bg-brand-bg/50 p-2.5 rounded-lg border border-brand-accent/50 bg-brand-accent/5">
                  <span className="text-yellow-800 font-bold">Payment Reference:</span>
                  <span className="font-mono font-bold text-brand-primary">{order.id}</span>
                </div>
              </div>

              <div className="text-xs text-brand-muted bg-brand-bg p-3 rounded-lg border">
                💡 <span className="font-bold text-brand-text">Note:</span> Please make sure to use your Order ID <span className="font-bold text-brand-primary">{order.id}</span> as the payment reference so we can link your transaction quickly.
              </div>
            </ClayCard>
          </div>

          {/* Upload Proof */}
          <div className="md:col-span-2 space-y-6">
            <ClayCard className="space-y-6">
              <h3 className="font-heading font-bold text-lg text-brand-text">Upload Proof</h3>
              
              <form onSubmit={handleSubmitPOP} className="space-y-4">
                <div className="bg-brand-bg/50 p-6 text-center rounded-[20px] border-2 border-green-500/20 space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <MessageCircle size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-text">Send Proof via WhatsApp</h4>
                    <p className="text-xs text-brand-muted mt-1">
                      Click the button below to open WhatsApp and send us a screenshot of your payment. We will verify it immediately!
                    </p>
                  </div>
                </div>

                <div className="bg-brand-bg p-3.5 rounded-[16px] text-xs text-brand-muted space-y-1.5 border">
                  <p className="font-bold text-brand-text flex items-center gap-1">Order Details</p>
                  <p>📍 Deliver to: <span className="font-semibold text-brand-text">{order.residence}</span></p>
                  <p>📦 Errand Category: <span className="font-semibold text-brand-text">{order.category.name}</span></p>
                  <p>💰 Total Amount: <span className="font-bold text-brand-primary">R{order.pricing.total.toFixed(2)}</span></p>
                </div>

                <ClayButton 
                  type="submit" 
                  fullWidth 
                  className="flex gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-b-[#128C7E]"
                  disabled={submitting}
                >
                  {submitting ? 'Redirecting...' : 'Open WhatsApp'} <ChevronRight size={18} />
                </ClayButton>
              </form>
            </ClayCard>
          </div>
        </div>

      </div>
    </div>
  );
}
