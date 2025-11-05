import { ReactNode } from 'react';

interface TooltipProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function Tooltip({ trigger, children }: TooltipProps) {
  return (
    <div className="relative group inline-flex">
      {trigger}
      <div className="invisible group-hover:visible absolute z-50 top-full left-0 mt-2 p-4 bg-gray-900 rounded-lg shadow-xl border border-gray-700 min-w-[300px]">
        {children}
      </div>
    </div>
  );
}
