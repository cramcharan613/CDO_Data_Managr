import React, { memo, useState, useRef, useEffect, useCallback } from 'react';

interface FeyAnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'elastic';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: 'fast' | 'normal' | 'slow' | 'slower';
  delay?: number;
  trigger?: 'hover' | 'focus' | 'visible' | 'click' | 'manual';
  className?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

interface FeyHoverEffectProps {
  children: React.ReactNode;
  effect?: 'lift' | 'glow' | 'scale' | 'float' | 'tilt' | 'pulse';
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

interface FeyFocusRingProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  offset?: number;
  className?: string;
}

interface FeyTransitionProps {
  show: boolean;
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'collapse';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  threshold = 0.1
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold]);

  return isVisible;
};

export const FeyAnimatedContainer = memo<FeyAnimatedContainerProps>(({
  children,
  animation = 'fade',
  direction = 'up',
  duration = 'normal',
  delay = 0,
  trigger = 'visible',
  className = '',
  onAnimationStart,
  onAnimationEnd,
}) => {
  const [isTriggered, setIsTriggered] = useState(trigger === 'manual');
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(containerRef);

  const getAnimationClasses = useCallback(() => {
    const durationClasses = {
      fast: 'duration-150',
      normal: 'duration-300',
      slow: 'duration-500',
      slower: 'duration-700',
    };

    const baseClasses = `transition-all ease-out ${durationClasses[duration]}`;

    if (!isTriggered && trigger !== 'manual') {
      // Initial state
      switch (animation) {
        case 'fade':
          return `${baseClasses} opacity-0`;
        case 'slide':
          const slideMap = {
            up: 'translate-y-4 opacity-0',
            down: '-translate-y-4 opacity-0',
            left: 'translate-x-4 opacity-0',
            right: '-translate-x-4 opacity-0',
          };
          return `${baseClasses} ${slideMap[direction]}`;
        case 'scale':
          return `${baseClasses} scale-95 opacity-0`;
        case 'bounce':
          return `${baseClasses} scale-95 opacity-0`;
        case 'elastic':
          return `${baseClasses} scale-90 opacity-0`;
        default:
          return baseClasses;
      }
    }

    // Animated state
    switch (animation) {
      case 'bounce':
        return `${baseClasses} scale-100 opacity-100 animate-bounce`;
      case 'elastic':
        return `${baseClasses} scale-100 opacity-100 animate-pulse`;
      default:
        return `${baseClasses} scale-100 opacity-100 translate-x-0 translate-y-0`;
    }
  }, [isTriggered, animation, direction, duration, trigger]);

  const handleTrigger = useCallback((shouldTrigger: boolean) => {
    if (shouldTrigger && !isTriggered) {
      setIsAnimating(true);
      onAnimationStart?.();
    }
    setIsTriggered(shouldTrigger);
  }, [isTriggered, onAnimationStart]);

  useEffect(() => {
    if (trigger === 'visible' && isVisible) {
      setTimeout(() => handleTrigger(true), delay);
    }
  }, [trigger, isVisible, delay, handleTrigger]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationEnd?.();
      }, parseInt(getAnimationClasses().match(/duration-(\d+)/)?.[1] || '300'));
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onAnimationEnd, getAnimationClasses]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') handleTrigger(true);
  }, [trigger, handleTrigger]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover') handleTrigger(false);
  }, [trigger, handleTrigger]);

  const handleFocus = useCallback(() => {
    if (trigger === 'focus') handleTrigger(true);
  }, [trigger, handleTrigger]);

  const handleBlur = useCallback(() => {
    if (trigger === 'focus') handleTrigger(false);
  }, [trigger, handleTrigger]);

  const handleClick = useCallback(() => {
    if (trigger === 'click') handleTrigger(!isTriggered);
  }, [trigger, isTriggered, handleTrigger]);

  return (
    <div
      ref={containerRef}
      className={`fey-animated-container ${getAnimationClasses()} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
});

export const FeyHoverEffect = memo<FeyHoverEffectProps>(({
  children,
  effect = 'lift',
  intensity = 'normal',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getEffectClasses = useCallback(() => {
    const intensityMultiplier = {
      subtle: 1,
      normal: 1.5,
      strong: 2,
    };

    const factor = intensityMultiplier[intensity];

    const effectClasses = {
      lift: isHovered
        ? `transform -translate-y-${Math.round(2 * factor)} shadow-lg`
        : 'transform translate-y-0',
      glow: isHovered
        ? `shadow-lg shadow-blue-500/25`
        : 'shadow-sm',
      scale: isHovered
        ? `transform scale-${100 + Math.round(5 * factor)}`
        : 'transform scale-100',
      float: isHovered
        ? `transform -translate-y-${Math.round(1 * factor)} scale-${100 + Math.round(2 * factor)}`
        : 'transform translate-y-0 scale-100',
      tilt: isHovered
        ? `transform rotate-${Math.round(2 * factor)} scale-${100 + Math.round(3 * factor)}`
        : 'transform rotate-0 scale-100',
      pulse: isHovered
        ? 'animate-pulse'
        : '',
    };

    return `transition-all duration-300 ease-out ${effectClasses[effect]}`;
  }, [effect, intensity, isHovered]);

  return (
    <div
      className={`fey-hover-effect ${getEffectClasses()} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
});

export const FeyFocusRing = memo<FeyFocusRingProps>(({
  children,
  variant = 'default',
  size = 'md',
  offset = 2,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getFocusRingClasses = useCallback(() => {
    if (!isFocused) return 'outline-none';

    const variantClasses = {
      default: 'ring-blue-500 ring-offset-white',
      primary: 'ring-purple-500 ring-offset-white',
      success: 'ring-green-500 ring-offset-white',
      warning: 'ring-yellow-500 ring-offset-white',
      error: 'ring-red-500 ring-offset-white',
    };

    const sizeClasses = {
      sm: 'ring-1',
      md: 'ring-2',
      lg: 'ring-4',
    };

    return `outline-none ${sizeClasses[size]} ${variantClasses[variant]} ring-offset-${offset} transition-all duration-200`;
  }, [isFocused, variant, size, offset]);

  return (
    <div
      className={`fey-focus-ring ${getFocusRingClasses()} rounded-lg ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      {children}
    </div>
  );
});

export const FeyTransition = memo<FeyTransitionProps>(({
  show,
  children,
  animation = 'fade',
  direction = 'up',
  duration = 300,
  className = '',
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const getTransitionClasses = useCallback(() => {
    const baseClasses = `transition-all ease-out`;
    const durationClass = `duration-${duration}`;

    if (!isAnimating) {
      // Exit state
      switch (animation) {
        case 'fade':
          return `${baseClasses} ${durationClass} opacity-0`;
        case 'slide':
          const slideExitMap = {
            up: 'translate-y-2 opacity-0',
            down: '-translate-y-2 opacity-0',
            left: 'translate-x-2 opacity-0',
            right: '-translate-x-2 opacity-0',
          };
          return `${baseClasses} ${durationClass} ${slideExitMap[direction]}`;
        case 'scale':
          return `${baseClasses} ${durationClass} scale-95 opacity-0`;
        case 'collapse':
          return `${baseClasses} ${durationClass} scale-y-0 opacity-0 h-0`;
        default:
          return `${baseClasses} ${durationClass}`;
      }
    }

    // Enter state
    return `${baseClasses} ${durationClass} opacity-100 translate-x-0 translate-y-0 scale-100 h-auto`;
  }, [isAnimating, animation, direction, duration]);

  if (!shouldRender) return null;

  return (
    <div className={`fey-transition ${getTransitionClasses()} ${className}`}>
      {children}
    </div>
  );
});

// Utility component for staggered animations
export const FeyStaggeredContainer = memo<{
  children: React.ReactNode[];
  staggerDelay?: number;
  animation?: FeyAnimatedContainerProps['animation'];
  className?: string;
}>(({
  children,
  staggerDelay = 100,
  animation = 'slide',
  className = '',
}) => {
  return (
    <div className={`fey-staggered-container ${className}`}>
      {children.map((child, index) => (
        <FeyAnimatedContainer
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          trigger="visible"
        >
          {child}
        </FeyAnimatedContainer>
      ))}
    </div>
  );
});

// Loading animation component
export const FeyLoadingSpinner = memo<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
}>(({
  size = 'md',
  variant = 'spinner',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const variants = {
    spinner: (
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
    ),
    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`bg-blue-600 rounded-full animate-pulse ${
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            }`}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    ),
    pulse: (
      <div className={`bg-blue-600 rounded-full animate-pulse ${sizeClasses[size]}`} />
    ),
    bars: (
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`bg-blue-600 animate-pulse ${
              size === 'sm' ? 'w-0.5 h-3' : size === 'md' ? 'w-1 h-4' : 'w-1.5 h-6'
            }`}
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
    ),
  };

  return (
    <div className={`fey-loading-spinner inline-flex items-center justify-center ${className}`}>
      {variants[variant]}
    </div>
  );
});

FeyAnimatedContainer.displayName = 'FeyAnimatedContainer';
FeyHoverEffect.displayName = 'FeyHoverEffect';
FeyFocusRing.displayName = 'FeyFocusRing';
FeyTransition.displayName = 'FeyTransition';
FeyStaggeredContainer.displayName = 'FeyStaggeredContainer';
FeyLoadingSpinner.displayName = 'FeyLoadingSpinner';

export type {
  FeyAnimatedContainerProps,
  FeyHoverEffectProps,
  FeyFocusRingProps,
  FeyTransitionProps,
};
