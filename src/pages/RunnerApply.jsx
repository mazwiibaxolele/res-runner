import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockResidences } from '../data/mockData';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { User, Mail, Hash, Phone, MapPin, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RunnerApply() {
  const { applyAsRunner } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentNumber: '',
    phone: '',
    residence: mockResidences[0].name,
    motivation: '',
    studentCardFile: '',
    idFile: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0].name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const app = applyAsRunner(formData);
    setAppId(app.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 flex items-center justify-center">
        <ClayCard className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary border-4 border-white shadow-clay-btn">
            <CheckCircle2 size={44} className="animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold">Application Sent!</h2>
          <p className="text-brand-muted text-lg">
            Thanks for applying, <span className="font-bold text-brand-text">{formData.name}</span>. Your application ID is <span className="font-mono bg-brand-bg px-2 py-1 rounded-md text-brand-primary text-sm font-semibold">{appId}</span>.
          </p>
          <div className="bg-brand-bg/50 p-4 rounded-[16px] border-2 border-white text-left space-y-2 text-sm text-brand-muted">
            <p>💡 <span className="font-bold text-brand-text">What happens next?</span></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Log in as <span className="font-bold">Admin</span> via the Login page.</li>
              <li>Navigate to the Admin Dashboard.</li>
              <li>Review and approve your application.</li>
              <li>Log in with your runner credentials to start fetching!</li>
            </ul>
          </div>
          <div className="flex gap-4 pt-2">
            <Link to="/" className="flex-1">
              <ClayButton variant="secondary" fullWidth>Go Home</ClayButton>
            </Link>
            <Link to="/login" className="flex-1">
              <ClayButton fullWidth>To Login</ClayButton>
            </Link>
          </div>
        </ClayCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-brand-text">Apply to Become a Runner</h1>
          <p className="text-brand-muted text-lg">
            Get paid to help fellow students. Set your own hours, accept runs when you want.
          </p>
        </div>

        {/* Application Form Card */}
        <ClayCard className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="font-heading font-bold text-sm text-brand-muted px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="clay-input w-full pl-11"
                  />
                </div>
              </div>

              {/* Student Email */}
              <div className="flex flex-col gap-2">
                <label className="font-heading font-bold text-sm text-brand-muted px-1">Wits Student Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="jane@student.wits.ac.za"
                    value={formData.email}
                    onChange={handleChange}
                    className="clay-input w-full pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Student Number */}
              <div className="flex flex-col gap-2">
                <label className="font-heading font-bold text-sm text-brand-muted px-1">Student Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                  <input
                    type="text"
                    name="studentNumber"
                    required
                    placeholder="1827364"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    className="clay-input w-full pl-11"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex flex-col gap-2">
                <label className="font-heading font-bold text-sm text-brand-muted px-1">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="082 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="clay-input w-full pl-11"
                  />
                </div>
              </div>
            </div>

            {/* Residence */}
            <div className="flex flex-col gap-2">
              <label className="font-heading font-bold text-sm text-brand-muted px-1">Primary Residence Hall</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/70" size={18} />
                <select
                  name="residence"
                  value={formData.residence}
                  onChange={handleChange}
                  className="clay-input w-full pl-11 appearance-none bg-white cursor-pointer"
                >
                  {mockResidences.map(res => (
                    <option key={res.id} value={res.name}>{res.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Motivation */}
            <div className="flex flex-col gap-2">
              <label className="font-heading font-bold text-sm text-brand-muted px-1">Why do you want to be a Runner?</label>
              <textarea
                name="motivation"
                required
                rows={3}
                placeholder="Tell us why you are a great fit and what hours you are normally available..."
                value={formData.motivation}
                onChange={handleChange}
                className="clay-input w-full"
              />
            </div>

            {/* Documents Upload Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-heading font-bold text-sm text-brand-muted px-1">Student Card Copy</label>
                <div className="relative clay-card bg-brand-bg/30 border-dashed border-2 border-slate-300 p-4 text-center cursor-pointer hover:bg-brand-bg transition-colors rounded-[16px]">
                  <input
                    type="file"
                    name="studentCardFile"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="mx-auto text-brand-muted mb-1" size={24} />
                  <span className="text-xs font-semibold block text-brand-text truncate">
                    {formData.studentCardFile || 'Click to select photo/PDF'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-heading font-bold text-sm text-brand-muted px-1">ID or Passport Copy</label>
                <div className="relative clay-card bg-brand-bg/30 border-dashed border-2 border-slate-300 p-4 text-center cursor-pointer hover:bg-brand-bg transition-colors rounded-[16px]">
                  <input
                    type="file"
                    name="idFile"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="mx-auto text-brand-muted mb-1" size={24} />
                  <span className="text-xs font-semibold block text-brand-text truncate">
                    {formData.idFile || 'Click to select photo/PDF'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <ClayButton type="submit" fullWidth className="flex gap-2">
                Submit Application <ChevronRight size={20} />
              </ClayButton>
            </div>
          </form>
        </ClayCard>
      </div>
    </div>
  );
}
