import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('rr_orders');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('rr_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item, category) => {
    if (activeCategory && activeCategory.id !== category.id) {
      toast.error('Please complete or clear your current order from ' + activeCategory.name + ' first.');
      return;
    }
    
    setActiveCategory(category);
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to order`);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== itemId);
      if (updated.length === 0) {
        setActiveCategory(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveCategory(null);
  };

  const calculateTotal = (distanceKm) => {
    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = activeCategory ? activeCategory.baseFee : 0;
    // Example distance pricing: R10 per km
    const distanceFee = distanceKm ? Math.ceil(distanceKm * 10) : 0;
    
    return {
      items: itemsTotal,
      service: serviceFee,
      distance: distanceFee,
      total: itemsTotal + serviceFee + distanceFee
    };
  };

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      ...orderDetails,
      items: [...cart],
      category: activeCategory,
      status: 'pending_eft', // pending_eft -> pending_runner -> assigned -> in_progress -> delivered
      createdAt: new Date().toISOString(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    toast.success('Order placed! Please upload EFT proof.');
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <OrderContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, activeCategory, 
      calculateTotal, placeOrder, orders, updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
