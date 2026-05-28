import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { Mail, Lock, User, Sparkles, LogIn } from 'lucide-react';

export function Login() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, registerCustomer } = useAuth();
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    if (isLoginTab) {
      const success = login(email, password);
      if (success) {
        navigate('/');
      }
    } else {
      if (!name || !email || !password) return;
      const success = registerCustomer(name, email, password);
      if (success) {
        navigate('/');
      }
    }
  };

  const handleDemoLogin = (role) => {
    const success = login('', '', role);
    if (success) {
      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'runner') navigate('/runner-dashboard');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-brand-text">Welcome to Res Runner</h2>
          <p className="text-brand-muted mt-2">Get your campus runs completed in double time 💚</p>
        </div>

        {/* Auth Card */}
        <ClayCard className="space-y-6">
          {/* Tabs */}
          <div className="flex bg-brand-bg p-1.5 rounded-[16px] border-2 border-white shadow-inner">
            <button
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 py-2 text-center font-heading font-bold text-sm rounded-[12px] transition-all ${
                isLoginTab 
                  ? 'bg-white text-brand-primary shadow-clay-btn border-2 border-white' 
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 py-2 text-center font-heading font-bold text-sm rounded-[12px] transition-all ${
                !isLoginTab 
                  ? 'bg-white text-brand-primary shadow-clay-btn border-2 border-white' 
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginTab && (
              <div className="flex flex-col gap-2">
                <label className="font-heading font-bold text-sm text-brand-muted px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="clay-input w-full pl-11"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-heading font-bold text-sm text-brand-muted px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                <input
                  type="email"
                  required
                  placeholder="jane@student.wits.ac.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="clay-input w-full pl-11"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-heading font-bold text-sm text-brand-muted px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="clay-input w-full pl-11"
                />
              </div>
            </div>

            <div className="pt-2">
              <ClayButton type="submit" fullWidth className="flex gap-2">
                <LogIn size={20} />
                {isLoginTab ? 'Sign In' : 'Create Account'}
              </ClayButton>
            </div>
          </form>
        </ClayCard>

        {/* Demo Mode Quick Access Card */}
        <ClayCard className="bg-brand-secondary/10 border-brand-secondary/30 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Sparkles size={20} className="animate-pulse" />
            <h3 className="font-heading font-bold text-md text-green-800">Demo Testing Dashboard</h3>
          </div>
          <p className="text-xs text-brand-muted">
            Instantly switch accounts to test student, runner, and admin functionalities without typing.
          </p>
          <div className="grid grid-cols-1 gap-2 pt-2">
            <button
              onClick={() => handleDemoLogin('customer')}
              className="py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-white rounded-[16px] text-left text-sm font-semibold shadow-sm flex items-center justify-between text-brand-text transition-all active:scale-98"
            >
              <span>👩‍🎓 Jane Student <span className="text-xs text-brand-muted">(Customer)</span></span>
              <span className="text-brand-primary text-xs font-bold font-heading">Activate →</span>
            </button>
            <button
              onClick={() => handleDemoLogin('runner')}
              className="py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-white rounded-[16px] text-left text-sm font-semibold shadow-sm flex items-center justify-between text-brand-text transition-all active:scale-98"
            >
              <span>🏃‍♂️ Speedy Gonzales <span className="text-xs text-brand-muted">(Runner)</span></span>
              <span className="text-brand-primary text-xs font-bold font-heading">Activate →</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-white rounded-[16px] text-left text-sm font-semibold shadow-sm flex items-center justify-between text-brand-text transition-all active:scale-98"
            >
              <span>🛠️ Admin User <span className="text-xs text-brand-muted">(Admin Portal)</span></span>
              <span className="text-brand-primary text-xs font-bold font-heading">Activate →</span>
            </button>
          </div>
        </ClayCard>

      </div>
    </div>
  );
}
