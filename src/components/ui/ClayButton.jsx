import React from 'react';
import { cn } from '../../utils/cn';

export function ClayButton({ 
  children, 
  variant = 'primary', 
  className, 
  fullWidth = false,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-200 outline-none select-none';
  
  const variants = {
    primary: 'clay-btn',
    secondary: 'clay-btn-secondary',
    ghost: 'text-brand-muted hover:text-brand-text bg-transparent hover:bg-brand-bg/50 rounded-[20px] font-heading font-semibold text-lg py-2 px-6',
  };

  return (
    <button 
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth ? 'w-full' : '',
        'py-3 px-6', // Default padding
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
