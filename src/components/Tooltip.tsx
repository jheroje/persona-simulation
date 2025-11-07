'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface TooltipProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function Tooltip({ trigger, children }: TooltipProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const adjust = () => {
    const w = wrapperRef.current;
    const t = tooltipRef.current;
    if (!w || !t) return;

    const wrapperRect = w.getBoundingClientRect();
    const tooltipRect = t.getBoundingClientRect();
    const padding = 8;

    const desiredLeft = wrapperRect.left;
    const minLeft = padding;
    const maxLeft = window.innerWidth - tooltipRect.width - padding;
    const targetLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

    setOffsetX(Math.round(targetLeft - wrapperRect.left));
  };

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent | MouseEvent) => {
    if (window.matchMedia('(hover: none)').matches) {
      e.stopPropagation();
      setIsOpen((o) => !o);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative group inline-flex"
      onMouseEnter={adjust}
      onFocus={adjust}
      onClick={handleClick}
    >
      {trigger}
      <div
        ref={tooltipRef}
        style={{ transform: `translateX(${offsetX}px)` }}
        className={`invisible group-hover:visible absolute z-50 top-full left-0 p-2 bg-neutral-900 rounded-lg shadow-xl border border-gray-700 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
