import React from 'react';

interface BrandLogoProps {
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ showWordmark = true, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="9" className="fill-indigo-950 dark:fill-indigo-900" />
        <path
          d="M6 19.5H11.5L14.5 11.5L18.5 25L22.5 14.5L25.5 19.5H30"
          stroke="#2DD4BF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className={`font-display font-bold tracking-tight text-slate-900 dark:text-slate-50 ${textSize}`}>
          Digital Automation Pulse
        </span>
      )}
    </span>
  );
};
