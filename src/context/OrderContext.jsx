import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { isFirebaseEnabled, db } from '../firebase/config';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('rr_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync orders to localStorage (only when Firebase is disabled)
  useEffect(() => {
    if (!isFirebaseEnabled) {
      localStorage.setItem('rr_orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Firebase Firestore real-time listener for orders
  useEffect(() => {
    if (!isFirebaseEnabled) return;

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    }, (error) => {
      console.error('Error listening to Firestore orders:', error);
    });

    return () => unsubscribe();
  }, []);

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
      const updated = prev.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0);
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
    const distanceFee = distanceKm ? Math.ceil(distanceKm * 10) : 0;
    
    return {
      items: itemsTotal,
      service: serviceFee,
      distance: distanceFee,
      total: itemsTotal + serviceFee + distanceFee
    };
  };

  const placeOrder = async (orderDetails) => {
    const orderId = 'ORD-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const newOrder = {
      id: orderId,
      ...orderDetails,
      items: [...cart],
      category: activeCategory,
      status: 'pending_eft',
      createdAt: new Date().toISOString(),
    };
    
    if (isFirebaseEnabled) {
      try {
        await setDoc(doc(db, 'orders', orderId), newOrder);
        clearCart();
        toast.success('Order placed! Please upload EFT proof.');
        return orderId;
      } catch (err) {
        console.error(err);
        toast.error('Failed to place order in cloud.');
        return null;
      }
    } else {
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      toast.success('Order placed! Please upload EFT proof.');
      return orderId;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (isFirebaseEnabled) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        toast.success(`Order status updated to ${newStatus}`);
      } catch (err) {
        console.error(err);
        toast.error('Failed to update order status in cloud.');
      }
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    }
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
