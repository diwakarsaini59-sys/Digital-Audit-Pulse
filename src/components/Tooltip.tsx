import React, { useId, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  text: string;
  label?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, label = 'More information' }) => {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-500 dark:hover:text-teal-400"
      >
        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-lg border border-slate-200 bg-slate-900 px-3 py-2 text-xs leading-relaxed font-normal text-slate-100 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          {text}
        </span>
      )}
    </span>
  );
};
