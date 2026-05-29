import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User } from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayButton } from '../ui/ClayButton';
import { useAuth } from '../../context/AuthContext';
import { db, isFirebaseEnabled } from '../../firebase/config';
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp 
} from 'firebase/firestore';

export function ChatBox({ orderId, onClose, recipientName = 'Runner' }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Load messages from Firestore
  useEffect(() => {
    if (!isFirebaseEnabled || !orderId) return;

    const q = query(
      collection(db, 'orders', orderId, 'chat'), 
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [orderId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !isFirebaseEnabled) return;

    try {
      await addDoc(collection(db, 'orders', orderId, 'chat'), {
        text: newMessage,
        senderId: user.email,
        senderName: user.name,
        senderRole: user.role,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm px-4 md:px-0">
      <ClayCard className="flex flex-col h-[400px] p-0 overflow-hidden shadow-2xl border-4">
        {/* Header */}
        <div className="bg-brand-primary text-white p-4 flex justify-between items-center rounded-t-[16px]">
          <div>
            <h3 className="font-bold font-heading flex items-center gap-2">
              <User size={18} /> Chat with {recipientName}
            </h3>
            <p className="text-[10px] text-white/80 font-semibold">Order: {orderId}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-bg/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-muted space-y-2 opacity-50">
              <Send size={32} />
              <p className="text-sm font-bold">Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.email;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-bold text-brand-muted px-1 mb-0.5">
                    {msg.senderName} {isMe ? '(You)' : ''}
                  </span>
                  <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                    isMe 
                      ? 'bg-brand-primary text-white rounded-br-sm' 
                      : 'bg-white border text-brand-text rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="clay-input flex-1 !py-2 !px-3 text-sm"
            />
            <ClayButton type="submit" disabled={!newMessage.trim()} className="!p-2 aspect-square flex items-center justify-center">
              <Send size={16} />
            </ClayButton>
          </form>
        </div>
      </ClayCard>
    </div>
  );
}
