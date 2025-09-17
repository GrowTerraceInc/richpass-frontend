'use client';
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export const CheckCircle: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="完了" {...props}>
    <circle cx="12" cy="12" r="12" fill="var(--color-success-500)" />
    <path d="M7 12.5l3 3 7-7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlayCircle: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="学習中" {...props}>
    <circle cx="12" cy="12" r="12" fill="var(--color-primary-500)" />
    <path d="M10 8l6 4-6 4z" fill="#fff" />
  </svg>
);

export const Lock: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="未開放" {...props}>
    <circle cx="12" cy="12" r="12" fill="var(--color-gray-300)" />
    <path d="M8 12h8v6H8z" fill="#fff" />
    <path d="M9 12V9a3 3 0 016 0v3" fill="none" stroke="#fff" strokeWidth="1.8" />
  </svg>
);

export const Trophy: React.FC<IconProps> = ({ size = 96, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="トロフィー" {...props}>
    <path d="M20 8h24v8a12 12 0 01-24 0V8z" fill="var(--color-primary-500)" />
    <path d="M16 12H8a8 8 0 008 8h0M48 12h8a8 8 0 01-8 8" fill="none" stroke="var(--color-primary-600, #E67E22)" strokeWidth="3" strokeLinecap="round"/>
    <path d="M28 28h8v6a4 4 0 01-8 0v-6z" fill="var(--color-primary-600, #E67E22)" />
    <rect x="22" y="40" width="20" height="4" rx="2" fill="var(--color-gray-400)" />
    <rect x="18" y="44" width="28" height="6" rx="2" fill="var(--color-gray-300)" />
  </svg>
);

export const StarSad: React.FC<IconProps> = ({ size = 96, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="悲しい星" {...props}>
    <path d="M32 6l7 14 16 2-12 11 3 16-14-7-14 7 3-16L9 22l16-2z" fill="var(--color-warning-400, #F6C453)"/>
    <path d="M24 34c2-2 14-2 16 0" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="26" cy="26" r="2" fill="#333"/><circle cx="38" cy="26" r="2" fill="#333"/>
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M18 3h3l-7.5 8.6L22 21h-6l-4.5-5.4L6 21H3l7.8-9.1L2 3h6l4.1 4.9z"/>
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22c4.78-.78 8.44-4.93 8.44-9.93z"/>
  </svg>
);

export const LineIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v7a7 7 0 007 7h8a5 5 0 005-5V6a2 2 0 00-2-2zM7 8h2v6H7V8zm4 0h2v6h-2V8zm6 0h-2v6h2V8z"/>
  </svg>
);
