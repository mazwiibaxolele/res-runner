import React from 'react';
import { cn } from '../../utils/cn';

export function ClayCard({ children, className, noPadding = false, ...props }) {
  return (
    <div 
      className={cn(
        'clay-card',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
