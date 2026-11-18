import React from 'react';
import { Tooltip } from './Tooltip';
import { getScoreColorTokens, getScoreGrade } from '../utils/url';

interface ScoreGaugeProps {
  label: string;
  score: number;
  tooltip: string;
  size?: 'hero' | 'compact';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  label,
  score,
  tooltip,
  size = 'compact',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const tokens = getScoreColorTokens(clamped);
  const grade = getScoreGrade(clamped);

  const isHero = size === 'hero';
  const radius = isHero ? 56 : 36;
  const strokeWidth = isHero ? 10 : 7;
  const svgSize = isHero ? 140 : 92;
  const center = svgSize / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${
        isHero ? 'p-6' : 'p-4'
      }`}
      aria-label={`${label}: ${clamped} out of 100, Grade ${grade}, ${tokens.label}`}
    >
      <div className="flex w-full items-center justify-between gap-1.5">
        <span className={`font-display font-semibold text-slate-800 dark:text-slate-100 ${isHero ? 'text-base' : 'text-xs'}`}>
          {label}
        </span>
        <Tooltip text={tooltip} label={`Explain ${label}`} />
      </div>

      <div className="relative my-3 flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="-rotate-90" aria-hidden="true">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={tokens.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono font-bold tabular-nums tracking-tight text-slate-900 dark:text-white ${
              isHero ? 'text-3xl' : 'text-xl'
            }`}
          >
            {clamped}
          </span>
          {isHero && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">out of 100</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono font-semibold tabular-nums ${tokens.badgeBg}`}
        >
          Grade {grade}
        </span>
        <span className={`font-medium ${tokens.text}`}>{tokens.label}</span>
      </div>
    </div>
  );
};
