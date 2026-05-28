import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { mockCategories, mockResidences } from '../data/mockData';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { 
  ShoppingBag, Pizza, Pill, Shirt, Plus, Minus, Trash2, 
  MapPin, ClipboardList, Info, HelpCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const iconMap = {
  ShoppingBag: ShoppingBag,
  Pizza: Pizza,
  Pill: Pill,
  Shirt: Shirt
};

export function Order() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cart, addToCart, removeFromCart, clearCart, 
    activeCategory, calculateTotal, placeOrder 
  } = useOrder();

  const [selectedCategory, setSelectedCategory] = useState(
    activeCategory || mockCategories[0]
  );
  
  const [selectedResidence, setSelectedResidence] = useState(mockResidences[0]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  // Handle category change (checks if cart needs clearing first)
  const handleCategorySelect = (category) => {
    if (cart.length > 0 && activeCategory && activeCategory.id !== category.id) {
      if (window.confirm('Selecting a new category will clear your current cart. Continue?')) {
        clearCart();
        setSelectedCategory(category);
      }
    } else {
      setSelectedCategory(category);
    }
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customItemName || !customItemPrice) {
      toast.error('Please enter name and estimated price');
      return;
    }
    const priceNum = parseFloat(customItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const newItem = {
      id: 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: `${customItemName} (Custom)`,
      price: priceNum
    };

    addToCart(newItem, selectedCategory);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  // Pricing calculations
  const fees = calculateTotal(selectedResidence.distanceKm);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please log in to place an order.');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const orderId = placeOrder({
      customerName: user.name,
      customerEmail: user.email,
      residence: selectedResidence.name,
      distanceKm: selectedResidence.distanceKm,
      pricing: fees,
    });

    navigate(`/checkout/${orderId}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-brand-text">Place an Errand</h1>
          <p className="text-brand-muted">Select a category, add items, and choose your residence.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main order choices */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockCategories.map(cat => {
                const IconComponent = iconMap[cat.icon] || HelpCircle;
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className={`clay-card p-4 text-center flex flex-col items-center gap-3 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-brand-primary bg-brand-secondary/20 shadow-clay-btn scale-[1.02]' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-3 rounded-full ${isSelected ? 'bg-brand-primary text-white' : 'bg-brand-bg text-brand-primary'}`}>
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-brand-text">{cat.name}</h3>
                      <span className="text-[11px] font-bold bg-white/80 border text-brand-muted py-0.5 px-2 rounded-full mt-1 inline-block">
                        R{cat.baseFee} fee
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Product selection card */}
            <ClayCard className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-brand-text">{selectedCategory.name}</h2>
                  <p className="text-brand-muted text-sm">{selectedCategory.description}</p>
                </div>
                <span className="font-mono text-xs font-bold text-brand-primary px-3 py-1 bg-brand-primary/10 rounded-full">
                  Base Fee: R{selectedCategory.baseFee.toFixed(2)}
                </span>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory.items.map(item => {
                  const cartItem = cart.find(i => i.id === item.id);
                  const qty = cartItem ? cartItem.quantity : 0;

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-brand-bg/50 border-2 border-white rounded-[20px] shadow-sm">
                      <div className="pr-2">
                        <h4 className="font-bold text-brand-text text-sm md:text-base">{item.name}</h4>
                        <span className="text-brand-primary font-bold font-heading text-sm">R{item.price.toFixed(2)}</span>
                      </div>
                      
                      {qty > 0 ? (
                        <div className="flex items-center bg-white border border-slate-200 rounded-[12px] shadow-sm p-1 gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-brand-muted hover:text-red-500 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold font-heading text-sm px-1 min-w-[16px] text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(item, selectedCategory)}
                            className="p-1 text-brand-primary hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item, selectedCategory)}
                          className="p-2 bg-white text-brand-primary border border-slate-200 rounded-[12px] hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Item */}
              <div className="bg-brand-bg/60 p-5 rounded-[20px] border-2 border-white space-y-4">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-brand-primary" />
                  <h3 className="font-heading font-bold text-sm text-brand-text">Need something not listed above?</h3>
                </div>
                
                <form onSubmit={handleAddCustomItem} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="md:col-span-1.5 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-brand-muted px-1">Item Name & Details</label>
                    <input
                      type="text"
                      placeholder="e.g. 1x Colgate Toothpaste 100ml"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="clay-input w-full !py-2.5"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-brand-muted px-1">Estimated Cost (ZAR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      className="clay-input w-full !py-2.5"
                    />
                  </div>
                  <ClayButton type="submit" variant="secondary" className="!py-2.5 h-[50px] text-sm">
                    Add Custom
                  </ClayButton>
                </form>
              </div>
            </ClayCard>
          </div>

          {/* Cart & Checkout column */}
          <div className="space-y-6">
            <ClayCard className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Order Summary
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-brand-muted space-y-2">
                  <ShoppingBag size={48} className="mx-auto text-slate-300 stroke-[1.5]" />
                  <p>Your basket is empty.</p>
                  <p className="text-xs">Add items from the left to start.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items list */}
                  <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <div>
                          <p className="font-bold text-brand-text">{item.name}</p>
                          <p className="text-brand-muted text-xs">
                            {item.quantity} x R{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-brand-text">R{(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Residence Delivery selector */}
                  <div className="flex flex-col gap-2 pt-2 border-t">
                    <label className="font-heading font-bold text-xs text-brand-muted px-1 flex items-center gap-1">
                      <MapPin size={14} className="text-brand-primary" /> Delivery Residence
                    </label>
                    <select
                      value={selectedResidence.id}
                      onChange={(e) => {
                        const res = mockResidences.find(r => r.id === e.target.value);
                        if (res) setSelectedResidence(res);
                      }}
                      className="clay-input w-full appearance-none bg-white cursor-pointer py-2 px-3 text-sm"
                    >
                      {mockResidences.map(res => (
                        <option key={res.id} value={res.id}>
                          {res.name} ({(res.distanceKm).toFixed(1)} km)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 pt-4 border-t text-sm">
                    <div className="flex justify-between text-brand-muted">
                      <span>Items Total</span>
                      <span>R{fees.items.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-muted">
                      <span>Category Base Fee</span>
                      <span>R{fees.service.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-muted">
                      <span>Distance Fee ({selectedResidence.distanceKm} km)</span>
                      <span>R{fees.distance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-text font-bold text-lg pt-2 border-t">
                      <span>Total Cost</span>
                      <span className="text-brand-primary">R{fees.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <ClayButton onClick={handleCheckout} fullWidth>
                      Place Order
                    </ClayButton>
                  </div>
                </div>
              )}
            </ClayCard>

            {/* Quick tips */}
            <ClayCard className="bg-brand-accent/10 border-brand-accent/30 p-4 flex gap-3 items-start">
              <Info className="text-yellow-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-brand-muted space-y-1">
                <p className="font-bold text-yellow-800">EFT Confirmation Info</p>
                <p>
                  Res Runner uses manual EFT payments. Once placed, make payment to our bank account and upload your POP. A runner will be dispatched immediately.
                </p>
              </div>
            </ClayCard>
          </div>
        </div>

      </div>
    </div>
  );
}
