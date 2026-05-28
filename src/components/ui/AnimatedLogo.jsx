import React, { useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';

export function AnimatedLogo({ className, size = 'md', isStatic = false }) {
  const containerRef = useRef(null);
  const shadowRef = useRef(null);

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-28 h-28',
    xl: 'w-44 h-44',
  };

  const handleMouseMove = useCallback((e) => {
    if (isStatic || !containerRef.current) return;
    const element = containerRef.current;
    const rect = element.getBoundingClientRect();
    
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rx = -(y / (rect.height / 2)) * 18;
    const ry = (x / (rect.width / 2)) * 18;
    
    // Direct DOM manipulation — no React re-render
    element.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (shadowRef.current) {
      shadowRef.current.style.transform = `translateZ(-15px) scale(${1 - Math.abs(rx) / 100})`;
    }
  }, [isStatic]);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    if (shadowRef.current) {
      shadowRef.current.style.transform = 'translateZ(-15px) scale(1)';
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center select-none cursor-pointer transition-transform duration-200 ease-out", 
        sizes[size], 
        className
      )}
      style={{
        perspective: '1000px',
        transform: isStatic ? 'none' : 'rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Soft Shadow Base */}
      {!isStatic && (
        <div 
          ref={shadowRef}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-2.5 bg-black/10 rounded-[100%] blur-sm transition-all duration-300"
          style={{
            transform: 'translateZ(-15px) scale(1)',
          }}
        ></div>
      )}

      {/* Vector SVG */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg transition-transform duration-300"
        style={{
          transform: isStatic ? 'none' : 'translateZ(10px)',
        }}
      >
        <defs>
          <linearGradient id="runnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B426B" />
            <stop offset="100%" stopColor="#155D93" />
          </linearGradient>
          <linearGradient id="bagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E9B772" />
            <stop offset="100%" stopColor="#C48E44" />
          </linearGradient>
        </defs>

        {/* Speed / Motion lines (Green) */}
        <g className="opacity-95">
          <line x1="28" y1="36" x2="48" y2="36" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" className={!isStatic ? "animate-[pulse_1.2s_infinite]" : ""} />
          <line x1="22" y1="41" x2="44" y2="41" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" className={!isStatic ? "animate-[pulse_1.5s_infinite_0.2s]" : ""} />
          <line x1="26" y1="46" x2="38" y2="46" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" className={!isStatic ? "animate-[pulse_1.0s_infinite_0.4s]" : ""} />
          <line x1="18" y1="51" x2="40" y2="51" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" className={!isStatic ? "animate-[pulse_1.7s_infinite_0.1s]" : ""} />
        </g>

        {/* Runner Silhouette (Blue) */}
        <g className={!isStatic ? "animate-[bounce_2.5s_ease-in-out_infinite]" : ""}>
          {/* Back arm bent backward */}
          <path 
            d="M48 40 L35 34 C31 32, 28 36, 30 40 L38 48" 
            stroke="url(#runnerGrad)" 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Back leg extended backward */}
          <path 
            d="M44 54 L26 62 C20 64, 18 70, 24 72 L32 68" 
            stroke="url(#runnerGrad)" 
            strokeWidth="8.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Torso */}
          <path 
            d="M52 40 C54 44, 48 50, 44 54" 
            stroke="url(#runnerGrad)" 
            strokeWidth="10.5" 
            strokeLinecap="round" 
          />

          {/* Head */}
          <circle cx="64" cy="28" r="7" fill="url(#runnerGrad)" />

          {/* Front leg bending forward */}
          <path 
            d="M44 54 L58 58 C63 60, 62 66, 58 72 L55 78" 
            stroke="url(#runnerGrad)" 
            strokeWidth="8.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Front arm holding bag */}
          <g>
            <path 
              d="M52 40 L65 44" 
              stroke="url(#runnerGrad)" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            
            <path 
              d="M65 44 L73 42" 
              stroke="url(#runnerGrad)" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Shopping Bag */}
            <g 
              className={!isStatic ? "animate-[wiggle_1.6s_ease-in-out_infinite]" : ""}
              style={{
                transformOrigin: '73px 42px',
              }}
            >
              {/* Bag Strap Handle */}
              <path 
                d="M72 42 C72 38, 76 38, 76 42" 
                stroke="#A77A42" 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none" 
              />
              
              {/* Bag Body */}
              <path 
                d="M69 43 H79 L81 54 C81 56, 79 57, 77 57 H71 C69 57, 67 56, 67 54 Z" 
                fill="url(#bagGrad)" 
                stroke="#A37130" 
                strokeWidth="1.2" 
                strokeLinejoin="round" 
              />
              
              {/* Shading crease line */}
              <path 
                d="M74 43.5 V56.5" 
                stroke="#A37130" 
                strokeWidth="1" 
                strokeDasharray="2,2" 
              />
            </g>
          </g>
        </g>
      </svg>
      
    </div>
  );
}
