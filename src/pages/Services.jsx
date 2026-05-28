import React from 'react';
import { mockCategories } from '../data/mockData';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { 
  ShoppingBag, Pizza, Pill, Shirt, HelpCircle, 
  MapPin, Clock, ShieldCheck, DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  ShoppingBag: ShoppingBag,
  Pizza: Pizza,
  Pill: Pill,
  Shirt: Shirt
};

export function Services() {
  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-text">Our Campus Services</h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            From quick grocery fetching to dropping off laundry, we've designed premium runner services specifically for students in Braamfontein.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockCategories.map(cat => {
            const IconComponent = iconMap[cat.icon] || HelpCircle;
            return (
              <ClayCard key={cat.id} className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary border-2 border-white shadow-clay-btn">
                      <IconComponent size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-brand-text">{cat.name}</h2>
                      <span className="text-xs bg-brand-primary/10 text-brand-primary border font-bold py-0.5 px-3 rounded-full inline-block mt-1">
                        Base service fee: R{cat.baseFee.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-brand-muted text-sm md:text-base">
                    {cat.description}
                  </p>

                  <div className="bg-brand-bg/50 p-4 rounded-[16px] border-2 border-white space-y-2">
                    <p className="text-xs font-bold text-brand-text">Common items we fetch:</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(item => (
                        <span key={item.id} className="text-xs bg-white text-brand-muted border px-2.5 py-1 rounded-full font-semibold">
                          {item.name} (~R{item.price})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link to="/order" className="w-full">
                  <ClayButton fullWidth className="text-sm py-2.5">
                    Order {cat.name}
                  </ClayButton>
                </Link>
              </ClayCard>
            );
          })}
        </div>

        {/* Pricing & Policy Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ClayCard className="space-y-3">
            <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl w-fit">
              <DollarSign size={20} />
            </div>
            <h3 className="font-heading font-bold text-lg">Clear Pricing</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Your final price is simply calculated: <span className="font-bold text-brand-text">Item Cost + Base Service Fee + Distance Fee</span> (R10 per kilometer from shop to your residence block).
            </p>
          </ClayCard>

          <ClayCard className="space-y-3">
            <div className="p-2.5 bg-green-50 text-brand-primary rounded-xl w-fit">
              <Clock size={20} />
            </div>
            <h3 className="font-heading font-bold text-lg">Operating Hours</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              We operate based on live runner availability. Typically online late into the night (until 11:00 PM) for snacks, emergency pharmacy, and fast food runs.
            </p>
          </ClayCard>

          <ClayCard className="space-y-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <MapPin size={20} />
            </div>
            <h3 className="font-heading font-bold text-lg">Location Limits</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Currently restricted to Wits University student residence halls and apartment complexes in the Braamfontein, Johannesburg area only.
            </p>
          </ClayCard>
        </div>

      </div>
    </div>
  );
}
