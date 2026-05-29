import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { Landmark, UploadCloud, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrder();
  const { users } = useAuth();
  const [popFile, setPopFile] = useState(null);
  const [popFileName, setPopFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const order = orders.find(o => o.id === orderId);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setPopFile(files[0]);
      setPopFileName(files[0].name);
      toast.success('Proof of payment attached!');
    }
  };

  const handleSubmitPOP = async (e) => {
    e.preventDefault();
    if (!popFile) {
      toast.error('Please upload your proof of payment.');
      return;
    }

    setSubmitting(true);
    
    try {
      if (storage) {
        const storageRef = ref(storage, `receipts/${orderId}_${popFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, popFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload failed:', error);
            toast.error('Failed to upload receipt');
            setSubmitting(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateOrderStatus(orderId, 'pending_runner', { popUrl: downloadURL });
            setSubmitting(false);
            navigate('/track');
          }
        );
      } else {
        // Fallback for local simulation
        setTimeout(() => {
          updateOrderStatus(orderId, 'pending_runner', { popUrl: 'simulated_local_url' });
          setSubmitting(false);
          navigate('/track');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during upload.');
      setSubmitting(false);
    }
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
                <div className="relative clay-card bg-brand-bg/30 border-dashed border-2 border-slate-300 p-6 text-center cursor-pointer hover:bg-brand-bg transition-colors rounded-[20px] flex flex-col items-center justify-center min-h-[140px]">
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="text-brand-primary mb-2 animate-pulse" size={32} />
                  <span className="text-xs font-semibold block text-brand-text truncate max-w-full">
                    {popFileName || 'Drag & drop or click to upload PDF/Image'}
                  </span>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                      <div className="bg-brand-primary h-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
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
                  className="flex gap-2"
                  disabled={submitting}
                >
                  {submitting ? 'Uploading...' : 'Submit POP'} <ChevronRight size={18} />
                </ClayButton>
              </form>
            </ClayCard>
          </div>
        </div>

      </div>
    </div>
  );
}
