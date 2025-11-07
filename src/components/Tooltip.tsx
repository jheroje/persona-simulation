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

  const isMobile = () => window.matchMedia('(hover: none)').matches;

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
    if (!isOpen || !isMobile()) return;

    const clickClose = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', clickClose);

    return () => document.removeEventListener('click', clickClose);
  }, [isOpen]);

  const clickToggle = (e: React.MouseEvent | MouseEvent) => {
    if (isMobile()) {
      e.stopPropagation();
      if (!isOpen) adjust();
      setIsOpen((o) => !o);
    }
  };

  const hoverOpen = () => {
    if (!isMobile()) {
      adjust();
      setIsOpen(true);
    }
  };

  const hoverClose = () => {
    if (!isMobile()) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative group inline-flex"
      onMouseEnter={hoverOpen}
      onMouseLeave={hoverClose}
      onClick={clickToggle}
    >
      {trigger}
      <div
        ref={tooltipRef}
        style={{ transform: `translateX(${offsetX}px)` }}
        className={`absolute z-50 top-full left-0 p-2 bg-neutral-900 rounded-lg shadow-xl border border-gray-700 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
