import { ReactNode, useEffect, useRef, useState } from 'react';

interface TooltipProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function Tooltip({ trigger, children }: TooltipProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);

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
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative group inline-flex"
      onMouseEnter={adjust}
      onFocus={adjust}
    >
      {trigger}
      <div
        ref={tooltipRef}
        style={{ transform: `translateX(${offsetX}px)` }}
        className="invisible group-hover:visible absolute z-50 top-full left-0 p-2 bg-neutral-900 rounded-lg shadow-xl border border-gray-700 will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
