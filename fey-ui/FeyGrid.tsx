import React, { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { FeyCard, FeyCardProps } from './FeyCard';

interface FeyGridItem {
  id: string;
  component: React.ReactNode;
  span?: {
    cols?: number;
    rows?: number;
  };
  order?: number;
  breakpoints?: {
    sm?: { cols?: number; rows?: number; order?: number };
    md?: { cols?: number; rows?: number; order?: number };
    lg?: { cols?: number; rows?: number; order?: number };
    xl?: { cols?: number; rows?: number; order?: number };
  };
}

interface FeyGridProps {
  items: FeyGridItem[];
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  autoFlow?: 'row' | 'column' | 'dense';
  className?: string;
  onItemClick?: (item: FeyGridItem) => void;
  virtualScroll?: boolean;
  maxHeight?: string;
}

const useResponsiveColumns = (columns: FeyGridProps['columns']) => {
  const [currentColumns, setCurrentColumns] = useState(columns?.default || 3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;

      if (width >= 1280 && columns?.xl) {
        setCurrentColumns(columns.xl);
      } else if (width >= 1024 && columns?.lg) {
        setCurrentColumns(columns.lg);
      } else if (width >= 768 && columns?.md) {
        setCurrentColumns(columns.md);
      } else if (width >= 640 && columns?.sm) {
        setCurrentColumns(columns.sm);
      } else {
        setCurrentColumns(columns?.default || 3);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  return currentColumns;
};

export const FeyGrid = memo<FeyGridProps>(({
  items,
  columns = { default: 3, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  autoFlow = 'row',
  className = '',
  onItemClick,
  virtualScroll = false,
  maxHeight = '600px',
}) => {
  const currentColumns = useResponsiveColumns(columns);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(items);

  const gapClasses = useMemo(() => {
    const gapMap = {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };
    return gapMap[gap];
  }, [gap]);

  const gridStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${currentColumns}, minmax(0, 1fr))`,
    gridAutoFlow: autoFlow,
    ...(virtualScroll && { maxHeight, overflowY: 'auto' as const }),
  }), [currentColumns, autoFlow, virtualScroll, maxHeight]);

  const handleItemClick = useCallback((item: FeyGridItem) => {
    onItemClick?.(item);
  }, [onItemClick]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [items]);

  useEffect(() => {
    if (virtualScroll) {
      // Simple virtual scrolling implementation
      // In a production app, you'd want a more sophisticated virtual scrolling library
      setVisibleItems(sortedItems.slice(0, 50)); // Show first 50 items
    } else {
      setVisibleItems(sortedItems);
    }
  }, [sortedItems, virtualScroll]);

  const getItemSpanClass = useCallback((item: FeyGridItem) => {
    const span = item.span;
    let classes = '';

    if (span?.cols && span.cols > 1) {
      classes += ` col-span-${Math.min(span.cols, currentColumns)}`;
    }
    if (span?.rows && span.rows > 1) {
      classes += ` row-span-${span.rows}`;
    }

    return classes;
  }, [currentColumns]);

  return (
    <div
      ref={containerRef}
      className={`fey-grid ${gapClasses} ${className}`}
      style={gridStyles}
    >
      {visibleItems.map((item) => (
        <div
          key={item.id}
          className={`fey-grid-item ${getItemSpanClass(item)}`}
          onClick={() => handleItemClick(item)}
        >
          {item.component}
        </div>
      ))}
    </div>
  );
});

FeyGrid.displayName = 'FeyGrid';

export type { FeyGridProps, FeyGridItem };
