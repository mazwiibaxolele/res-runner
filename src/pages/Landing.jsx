import React from 'react';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { AnimatedLogo } from '../components/ui/AnimatedLogo';
import { Clock, MapPin, Package, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 py-12 flex flex-col items-center">
          <div className="inline-block p-4 bg-brand-surface rounded-[32px] border-4 border-white shadow-clay-card mb-4">
            <AnimatedLogo size="xl" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-brand-text max-w-4xl mx-auto leading-tight">
            Your Campus. Your Essentials. <span className="text-brand-primary">Delivered.</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-muted max-w-2xl mx-auto font-body">
            The premium student runner service for Wits and Braamfontein. Late-night snacks, groceries, and essentials straight to your res.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/order">
              <ClayButton className="text-xl py-4 px-10">Order Now</ClayButton>
            </Link>
            <Link to="/services">
              <ClayButton variant="secondary" className="text-xl py-4 px-10">View Services</ClayButton>
            </Link>
          </div>
          <p className="text-brand-muted text-sm mt-4 flex items-center justify-center gap-2">
            <MapPin size={16} /> Currently serving Braamfontein only
          </p>
        </section>

        {/* How It Works */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ClayCard className="text-center space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary mb-2 shadow-inner">
                <span className="text-2xl font-bold font-heading">1</span>
              </div>
              <h3 className="text-xl font-bold">Request a Run</h3>
              <p className="text-brand-muted">Select what you need—from midnight snacks to pharmacy essentials.</p>
            </ClayCard>
            <ClayCard className="text-center space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary mb-2 shadow-inner">
                <span className="text-2xl font-bold font-heading">2</span>
              </div>
              <h3 className="text-xl font-bold">EFT Payment</h3>
              <p className="text-brand-muted">Upload your proof of payment. Secure, fast, and student-friendly.</p>
            </ClayCard>
            <ClayCard className="text-center space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary mb-2 shadow-inner">
                <span className="text-2xl font-bold font-heading">3</span>
              </div>
              <h3 className="text-xl font-bold">We Deliver</h3>
              <p className="text-brand-muted">Track your verified runner in real-time straight to your block.</p>
            </ClayCard>
          </div>
        </section>

        {/* Features Bento */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
            <ClayCard className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-gradient-to-br from-brand-secondary/30 to-brand-primary/10">
              {/* Decorative faint background icon */}
              <div className="absolute -top-12 -right-12 opacity-10 pointer-events-none">
                <Clock size={240} className="text-brand-primary -rotate-12" />
              </div>
              
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-white p-4 rounded-2xl w-fit shadow-sm">
                    <Clock className="text-brand-primary" size={32} />
                  </div>
                  <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    24/7 Available
                  </span>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-3xl font-bold mb-3">Late Night Runs</h3>
                  <p className="text-brand-muted text-lg max-w-sm">When the shops are closed and Uber Eats is too expensive, our verified student runners have got you covered until the early hours.</p>
                </div>
              </div>
            </ClayCard>
            
            <ClayCard className="md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-brand-accent/20 p-3 rounded-xl">
                  <ShieldCheck className="text-yellow-600" size={24} />
                </div>
                <h3 className="text-xl font-bold">Verified Runners</h3>
              </div>
              <p className="text-brand-muted">Trust is premium. All runners are verified students.</p>
            </ClayCard>

            <ClayCard className="md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Package className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold">Any Errand</h3>
              </div>
              <p className="text-brand-muted">Groceries, laundry, printing, or pharmacy. Just ask.</p>
            </ClayCard>
          </div>
        </section>

      </div>
    </div>
  );
}
