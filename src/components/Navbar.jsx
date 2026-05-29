import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Award, User, Settings as SettingsIcon } from 'lucide-react';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { ClayButton } from './ui/ClayButton';
import { useAuth } from '../context/AuthContext';
import { isFirebaseEnabled } from '../firebase/config';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isCurrentPath = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-[24px] border-4 border-white shadow-clay-card px-6 py-3 flex items-center justify-between transition-all">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <AnimatedLogo size="sm" isStatic />
            <div className="flex flex-col">
              <span className="font-heading font-extrabold italic text-2xl tracking-tight leading-none">
                <span className="text-[#0B426B]">Res</span>
                <span className="text-[#16A34A]">Runner</span>
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 border self-start leading-none font-sans uppercase tracking-wider ${
                isFirebaseEnabled 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                {isFirebaseEnabled ? 'Cloud Live' : 'Local Demo'}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 font-semibold text-brand-muted">
            <Link to="/" className={isCurrentPath('/') ? 'text-brand-primary' : 'hover:text-brand-text transition-colors'}>Home</Link>
            <Link to="/services" className={isCurrentPath('/services') ? 'text-brand-primary' : 'hover:text-brand-text transition-colors'}>Services</Link>
            
            {user && user.role === 'customer' && (
              <>
                <Link to="/order" className={isCurrentPath('/order') ? 'text-brand-primary' : 'hover:text-brand-text transition-colors'}>Place Order</Link>
                <Link to="/track" className={isCurrentPath('/track') ? 'text-brand-primary' : 'hover:text-brand-text transition-colors'}>Track Orders</Link>
              </>
            )}

            {user && (user.role === 'runner' || user.role === 'admin') && (
              <Link to="/runner-dashboard" className={isCurrentPath('/runner-dashboard') ? 'text-brand-primary font-bold' : 'hover:text-brand-text transition-colors'}>
                🏃‍♂️ Runner Dashboard
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin-dashboard" className={isCurrentPath('/admin-dashboard') ? 'text-brand-primary font-bold' : 'hover:text-brand-text transition-colors'}>
                🛠️ Admin Dashboard
              </Link>
            )}

            <Link to="/runner-apply" className={isCurrentPath('/runner-apply') ? 'text-brand-primary' : 'hover:text-brand-text transition-colors'}>Become a Runner</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-brand-bg px-4 py-2 rounded-[16px] border-2 border-white shadow-inner">
                <span className="text-sm font-semibold text-brand-text flex items-center gap-1.5">
                  {user.role === 'admin' && <Shield size={14} className="text-brand-primary" />}
                  {user.role === 'runner' && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary inline-block"></span>}
                  {user.name.split(' ')[0]}
                </span>
                <Link to="/settings" className="text-brand-muted hover:text-brand-primary transition-colors p-1" title="Settings">
                  <SettingsIcon size={18} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-brand-muted hover:text-red-500 transition-colors p-1"
                  title="Log out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="font-semibold text-brand-text hover:text-brand-primary transition-colors px-4">Log in</Link>
                <Link to="/order">
                  <ClayButton className="py-2 px-5 text-base">Order Now</ClayButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-brand-text bg-brand-bg rounded-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute top-[88px] left-4 right-4 bg-white/95 backdrop-blur-xl border-4 border-white shadow-clay-card rounded-[24px] p-6 flex flex-col gap-4 animate-soft-bounce pointer-events-auto origin-top">
            <Link to="/" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg">Home</Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg">Services</Link>
            <Link to="/runner-apply" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg">Become a Runner</Link>
            
            {user && user.role === 'customer' && (
              <>
                <Link to="/order" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg">Place Order</Link>
                <Link to="/track" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg">Track Orders</Link>
              </>
            )}

            {user && (user.role === 'runner' || user.role === 'admin') && (
              <Link to="/runner-dashboard" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg text-brand-primary">
                Runner Dashboard
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg text-brand-primary">
                Admin Dashboard
              </Link>
            )}

            <div className="h-1 w-full bg-brand-bg rounded-full my-2"></div>
            
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="bg-brand-bg px-4 py-3 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-brand-text">{user.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-brand-primary/20 text-brand-primary rounded-full uppercase">
                    {user.role}
                  </span>
                </div>
                <Link to="/settings" onClick={() => setIsOpen(false)} className="w-full text-center">
                  <ClayButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <SettingsIcon size={18} /> Settings
                  </ClayButton>
                </Link>
                <ClayButton onClick={handleLogout} variant="secondary" className="w-full text-red-500 border-red-200">
                  Log Out
                </ClayButton>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="font-bold text-lg p-2 rounded-xl hover:bg-brand-bg text-center">Log in</Link>
                <Link to="/order" onClick={() => setIsOpen(false)} className="w-full">
                  <ClayButton fullWidth>Order Now</ClayButton>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
