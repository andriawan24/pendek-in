'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-zinc-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border-2 bg-zinc-800 px-4 py-3',
            'text-white placeholder:text-zinc-500',
            'transition-all duration-200',
            'focus:ring-offset-charcoal focus:ring-2 focus:ring-offset-2 focus:outline-none',
            error
              ? 'border-salmon focus:ring-salmon'
              : 'focus:border-electric-yellow focus:ring-electric-yellow border-zinc-700',
            className
          )}
          {...props}
        />
        {error && <p className="text-salmon mt-2 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
