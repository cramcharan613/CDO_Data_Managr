import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal, Maximize2 } from 'lucide-react';

interface FeyNestedItem {
  id: string;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  children?: FeyNestedItem[];
  metadata?: Record<string, any>;
  actions?: React.ReactNode;
}

interface FeyCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  elevation?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  interactive?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  headerActions?: React.ReactNode;
  nested?: boolean;
  nestedItems?: FeyNestedItem[];
  onClick?: () => void;
  onToggle?: (expanded: boolean) => void;
  onExpand?: () => void;
  animate?: boolean;
  contextMenu?: boolean;
}

const FeyNestedList = memo<{
  items: FeyNestedItem[];
  level?: number;
  onItemClick?: (item: FeyNestedItem) => void;
}>(({ items, level = 0, onItemClick }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleItemClick = useCallback((item: FeyNestedItem) => {
    onItemClick?.(item);
  }, [onItemClick]);

  return (
    <div className={`fey-nested-list ${level > 0 ? 'ml-4 border-l border-gray-200 pl-4' : ''}`}>
      {items.map((item) => (
        <div key={item.id} className="fey-nested-item">
          <div
            className="
              flex items-center justify-between p-3 rounded-lg
              hover:bg-gray-50 cursor-pointer fey-transition
              border border-transparent hover:border-gray-200
            "
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {item.children && item.children.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(item.id);
                  }}
                  className="
                    flex-shrink-0 p-1 rounded-md hover:bg-gray-100
                    fey-transition fey-focus-ring
                  "
                  aria-expanded={expandedItems.has(item.id)}
                >
                  {expandedItems.has(item.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="fey-text-sm fey-font-medium text-gray-900 truncate">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="fey-text-xs text-gray-500 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>

            {item.actions && (
              <div
                className="flex-shrink-0 ml-2"
                onClick={(e) => e.stopPropagation()}
              >
                {item.actions}
              </div>
            )}
          </div>

          {item.content && (
            <div className="px-3 pb-2">
              {item.content}
            </div>
          )}

          {item.children && expandedItems.has(item.id) && (
            <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
              <FeyNestedList
                items={item.children}
                level={level + 1}
                onItemClick={onItemClick}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

export const FeyCard = memo<FeyCardProps>(({
  children,
  title,
  subtitle,
  className = '',
  elevation = 'sm',
  interactive = false,
  collapsible = false,
  defaultExpanded = true,
  headerActions,
  nested = false,
  nestedItems,
  onClick,
  onToggle,
  onExpand,
  animate = true,
  contextMenu = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isHovered, setIsHovered] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  }, [isExpanded, onToggle]);

  const handleCardClick = useCallback(() => {
    if (onClick && !collapsible) {
      onClick();
    }
  }, [onClick, collapsible]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (contextMenu) {
      e.preventDefault();
      setShowContextMenu(true);
    }
  }, [contextMenu]);

  const handleExpand = useCallback(() => {
    onExpand?.();
  }, [onExpand]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  const baseClasses = `
    fey-card group relative
    bg-white border border-gray-200 rounded-xl overflow-hidden
    ${animate ? 'fey-transition fey-shadow-hover' : ''}
    ${isHovered ? `fey-shadow-hover-${elevation}` : `fey-shadow-${elevation}`}
    ${interactive ? 'cursor-pointer hover:border-gray-300 hover:shadow-md' : ''}
    ${nested ? 'ml-6 border-l-4 border-l-blue-200' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      ref={cardRef}
      className={baseClasses}
      onClick={handleCardClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      {(title || subtitle || headerActions || collapsible) && (
        <div className="fey-card-header px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {collapsible && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                  className="
                    flex-shrink-0 p-1 rounded-md hover:bg-gray-100
                    fey-transition fey-focus-ring
                  "
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              )}

              <div className="min-w-0 flex-1">
                {title && (
                  <h3 className="fey-text-lg fey-font-semibold text-gray-900 truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="fey-text-sm text-gray-500 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onExpand && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand();
                  }}
                  className="
                    opacity-0 group-hover:opacity-100 p-1 rounded-md
                    hover:bg-gray-100 fey-transition fey-focus-ring
                  "
                  aria-label="Expand to full view"
                >
                  <Maximize2 className="w-4 h-4 text-gray-500" />
                </button>
              )}

              {headerActions && (
                <div onClick={(e) => e.stopPropagation()}>
                  {headerActions}
                </div>
              )}

              {contextMenu && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowContextMenu(!showContextMenu);
                  }}
                  className="
                    opacity-0 group-hover:opacity-100 p-1 rounded-md
                    hover:bg-gray-100 fey-transition fey-focus-ring
                  "
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {(!collapsible || isExpanded) && (
        <div className={`fey-card-content ${animate ? 'animate-in slide-in-from-top-2 duration-300' : ''}`}>
          {nestedItems && nestedItems.length > 0 ? (
            <div className="p-4">
              <FeyNestedList
                items={nestedItems}
                onItemClick={(item) => console.log('Nested item clicked:', item)}
              />
            </div>
          ) : (
            <div className="p-6">
              {children}
            </div>
          )}
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <div className="
          absolute top-12 right-4 z-50
          bg-white border border-gray-200 rounded-lg fey-shadow-lg
          py-2 min-w-48 animate-in fade-in-0 zoom-in-95 duration-200
        ">
          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 fey-text-sm">
            Edit
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 fey-text-sm">
            Duplicate
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 fey-text-sm">
            Share
          </button>
          <hr className="my-1 border-gray-200" />
          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 fey-text-sm text-red-600">
            Delete
          </button>
        </div>
      )}
    </div>
  );
});

FeyCard.displayName = 'FeyCard';
FeyNestedList.displayName = 'FeyNestedList';

export type { FeyCardProps, FeyNestedItem };
