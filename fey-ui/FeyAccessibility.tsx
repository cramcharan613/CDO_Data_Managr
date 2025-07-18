import React, { memo, useRef, useEffect, useCallback } from 'react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceOptimization';

interface FeySkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const FeySkipLink = memo<FeySkipLinkProps>(({ href, children, className = '' }) => {
  return (
    <a
      href={href}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        bg-blue-600 text-white px-4 py-2 rounded-md z-50
        transition-all duration-200 ${className}`}
    >
      {children}
    </a>
  );
});

FeySkipLink.displayName = 'FeySkipLink';

interface FeyLiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export const FeyLiveRegion = memo<FeyLiveRegionProps>(({
  message,
  politeness = 'polite',
  atomic = true,
  className = ''
}) => {
  const { markStart, markEnd } = usePerformanceMonitor('FeyLiveRegion');

  useEffect(() => {
    markStart('live-region-update');
    markEnd('live-region-update', 10);
  }, [message, markStart, markEnd]);

  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
});

FeyLiveRegion.displayName = 'FeyLiveRegion';

interface FeyFocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;
}

export const FeyFocusTrap = memo<FeyFocusTrapProps>(({
  children,
  active = true,
  initialFocus,
  restoreFocus = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!active || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [active, getFocusableElements]);

  useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }

      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, initialFocus, restoreFocus, getFocusableElements, handleKeyDown]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
});

FeyFocusTrap.displayName = 'FeyFocusTrap';

interface FeyVisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export const FeyVisuallyHidden = memo<FeyVisuallyHiddenProps>(({ children, className = '' }) => {
  return (
    <span className={`sr-only ${className}`}>
      {children}
    </span>
  );
});

FeyVisuallyHidden.displayName = 'FeyVisuallyHidden';

interface FeyKeyboardNavigationProps {
  children: React.ReactNode;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  className?: string;
}

export const FeyKeyboardNavigation = memo<FeyKeyboardNavigationProps>(({
  children,
  onNavigate,
  className = ''
}) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!onNavigate) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onNavigate('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onNavigate('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onNavigate('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNavigate('right');
        break;
    }
  }, [onNavigate]);

  return (
    <div
      className={className}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {children}
    </div>
  );
});

FeyKeyboardNavigation.displayName = 'FeyKeyboardNavigation';

interface FeyProgressAnnouncerProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export const FeyProgressAnnouncer = memo<FeyProgressAnnouncerProps>(({
  value,
  max = 100,
  label = 'Progress',
  className = ''
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={`${label}: ${percentage}% complete`}
      className={className}
    >
      <FeyVisuallyHidden>
        {`${label}: ${percentage}% complete`}
      </FeyVisuallyHidden>
    </div>
  );
});

FeyProgressAnnouncer.displayName = 'FeyProgressAnnouncer';

export default {
  FeySkipLink,
  FeyLiveRegion,
  FeyFocusTrap,
  FeyVisuallyHidden,
  FeyKeyboardNavigation,
  FeyProgressAnnouncer,
};
