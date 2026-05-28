import React, { useEffect, useState } from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { mockCategories, mockResidences } from '../../data/mockData';

// Helper emoji picker based on item names
const getEmoji = (itemName) => {
  const name = itemName.toLowerCase();
  if (name.includes('coca') || name.includes('coke') || name.includes('drink')) return '🥤';
  if (name.includes('doritos') || name.includes('snack') || name.includes('biscuit')) return '🍿';
  if (name.includes('noodles')) return '🍜';
  if (name.includes('mac') || name.includes('burger') || name.includes('steers')) return '🍔';
  if (name.includes('kfc') || name.includes('chicken')) return '🍗';
  if (name.includes('panado') || name.includes('syrup') || name.includes('cough') || name.includes('pill')) return '💊';
  if (name.includes('plaster') || name.includes('first')) return '🩹';
  if (name.includes('wash') || name.includes('laundry')) return '🧺';
  if (name.includes('iron')) return '👕';
  return '📦';
};

export function RunningAcrossScreen() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [phrase, setPhrase] = useState('');

  const triggerRun = () => {
    // Collect all items from the mock database categories
    const allItems = mockCategories.flatMap(cat => cat.items.map(i => i.name));
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    
    // Select a random Wits student residence
    const randomRes = mockResidences[Math.floor(Math.random() * mockResidences.length)].name.replace(' (Clifton Heights)', '').replace(' Halls of Residence', '');
    
    const emoji = getEmoji(randomItem);
    
    // Set formatted speech text: Delivering [Item] to [Residence]...
    setPhrase(`Delivering ${randomItem} to ${randomRes}... ${emoji}`);
    setIsAnimating(true);
  };

  useEffect(() => {
    // Initial run across screen after a short delay
    const initialTimeout = setTimeout(() => {
      triggerRun();
    }, 3000);

    // Re-trigger every 35 seconds to keep the application feeling alive
    const interval = setInterval(() => {
      triggerRun();
    }, 35000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!isAnimating) return null;

  return (
    <div 
      className="fixed bottom-8 z-50 pointer-events-none flex flex-col items-center select-none"
      style={{
        left: '-250px',
        animation: 'runAcross 9s linear forwards',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      {/* Playful speech bubble */}
      <div className="bg-white text-brand-text font-heading font-extrabold text-[11px] px-3.5 py-2.5 rounded-[16px] border-4 border-white shadow-clay-card relative mb-3 max-w-[220px] text-center animate-bounce leading-snug">
        {phrase}
        {/* Triangle pointer */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-white rotate-45"></div>
      </div>

      {/* Runner Logo */}
      <div 
        style={{
          transform: 'rotateY(20deg) rotateX(5deg)',
        }}
      >
        <AnimatedLogo size="lg" />
      </div>

      {/* Keyframe animation for runner sliding across viewport */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes runAcross {
          0% {
            left: -250px;
          }
          100% {
            left: calc(100vw + 10px);
          }
        }
      `}} />
    </div>
  );
}
