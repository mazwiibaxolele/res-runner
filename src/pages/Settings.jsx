import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { User, Landmark, ShieldAlert, Save, Trash2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { user, updateUserProfile, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    // Admin specific
    bankName: '',
    accountNumber: '',
    branchCode: '',
    accountType: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bankName: user.bankDetails?.bankName || '',
        accountNumber: user.bankDetails?.accountNumber || '',
        branchCode: user.bankDetails?.branchCode || '',
        accountType: user.bankDetails?.accountType || ''
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const updateData = {
      name: formData.name,
      phone: formData.phone,
    };

    if (user.role === 'admin') {
      updateData.bankDetails = {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        branchCode: formData.branchCode,
        accountType: formData.accountType
      };
    }

    await updateUserProfile(user.id, updateData);
    setSaving(false);
  };

  const handleDelete = async () => {
    const success = await deleteAccount();
    if (success) {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-4xl font-bold text-brand-text">Account Settings</h1>
          <p className="text-brand-muted">Manage your profile, preferences, and security.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Details */}
          <ClayCard className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <User className="text-brand-primary" size={20} />
              <h2 className="text-xl font-bold">Personal Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-muted">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="clay-input w-full"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-muted">Email Address (Read Only)</label>
                <input 
                  type="email" 
                  value={user.email}
                  disabled
                  className="clay-input w-full opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-muted">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="clay-input w-full"
                  placeholder="e.g. 0612345678"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-muted">Account Role</label>
                <div className="clay-input w-full bg-slate-100 flex items-center font-bold text-brand-primary uppercase text-sm">
                  {user.role}
                </div>
              </div>
            </div>
          </ClayCard>

          {/* Admin Bank Details */}
          {user.role === 'admin' && (
            <ClayCard className="space-y-4 border-2 border-brand-primary/20">
              <div className="flex items-center gap-2 border-b pb-3">
                <Landmark className="text-brand-primary" size={20} />
                <h2 className="text-xl font-bold">Platform Bank Details (EFT Payments)</h2>
              </div>
              <p className="text-xs text-brand-muted">These details are shown to customers at checkout when they need to make EFT payments.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted">Bank Name</label>
                  <input 
                    type="text" 
                    value={formData.bankName}
                    onChange={e => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    className="clay-input w-full"
                    placeholder="e.g. FNB"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted">Account Number</label>
                  <input 
                    type="text" 
                    value={formData.accountNumber}
                    onChange={e => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="clay-input w-full"
                    placeholder="e.g. 62912345678"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted">Branch Code</label>
                  <input 
                    type="text" 
                    value={formData.branchCode}
                    onChange={e => setFormData(prev => ({ ...prev, branchCode: e.target.value }))}
                    className="clay-input w-full"
                    placeholder="e.g. 250655"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted">Account Type</label>
                  <input 
                    type="text" 
                    value={formData.accountType}
                    onChange={e => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                    className="clay-input w-full"
                    placeholder="e.g. Business Cheque"
                  />
                </div>
              </div>
            </ClayCard>
          )}

          <div className="flex justify-end">
            <ClayButton type="submit" disabled={saving} className="flex items-center gap-2">
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </ClayButton>
          </div>
        </form>

        {/* Danger Zone */}
        <ClayCard className="bg-red-50/50 border-red-100 mt-12 space-y-4">
          <div className="flex items-center gap-2 border-b border-red-100 pb-3">
            <ShieldAlert className="text-red-500" size={20} />
            <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-bold text-brand-text">Sign Out</h3>
              <p className="text-xs text-brand-muted">Log out of your current session.</p>
            </div>
            <ClayButton variant="secondary" onClick={handleLogout} className="flex items-center gap-2 shrink-0 border-slate-200">
              <LogOut size={16} /> Log Out
            </ClayButton>
          </div>

          <div className="h-px bg-red-100 w-full my-2"></div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-bold text-red-700">Delete Account</h3>
              <p className="text-xs text-red-600/70">Permanently remove your account and personal data. This action cannot be undone.</p>
            </div>
            {!showDeleteConfirm ? (
              <ClayButton variant="secondary" onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50 shrink-0">
                <Trash2 size={16} /> Delete Account
              </ClayButton>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setShowDeleteConfirm(false)} className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2">
                  Cancel
                </button>
                <ClayButton onClick={handleDelete} className="bg-red-500 text-white border-b-red-700 hover:bg-red-600 text-sm">
                  Yes, Delete Forever
                </ClayButton>
              </div>
            )}
          </div>
        </ClayCard>

      </div>
    </div>
  );
}
