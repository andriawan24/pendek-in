'use client';

import { useEffect, useId, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type DialogSize = 'md' | 'lg';

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'lg',
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: DialogSize;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const descId = useId();

  const sizeClass = useMemo(() => {
    switch (size) {
      case 'md':
        return 'max-w-lg';
      case 'lg':
      default:
        return 'max-w-2xl';
    }
  }, [size]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onOpenChange(false);
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onOpenChange(false);
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className={cn(
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-[calc(100%-2rem)] p-0',
        sizeClass,
        'rounded-2xl border-2 border-zinc-700 bg-zinc-900 text-white',
        'shadow-neo-lg',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        className
      )}
      onClick={(e) => {
        if (e.currentTarget === e.target) onOpenChange(false);
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b-2 border-zinc-700 p-4 lg:p-5">
        <div className="min-w-0">
          <h2
            id={titleId}
            className="text-lg font-bold tracking-wide uppercase"
          >
            {title}
          </h2>
          {description ? (
            <p id={descId} className="mt-1 text-sm text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-auto p-4 lg:p-5">{children}</div>
    </dialog>
  );
}
