import React, { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, Check, Circle, Square, MoreHorizontal } from 'lucide-react';

interface FeyMenuAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;
  type?: 'action' | 'checkbox' | 'radio' | 'separator' | 'submenu';
  submenu?: FeyMenuAction[];
  onClick?: () => void;
}

interface FeyContextMenuProps {
  actions: FeyMenuAction[];
  trigger: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';
  closeOnAction?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

interface FeyMenuItemProps {
  action: FeyMenuAction;
  onClose: () => void;
  level?: number;
}

const FeyMenuItem = memo<FeyMenuItemProps>(({ action, onClose, level = 0 }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (action.type === 'submenu' && action.submenu) {
      setSubmenuOpen(!submenuOpen);
    } else if (action.onClick && !action.disabled) {
      action.onClick();
      onClose();
    }
  }, [action, submenuOpen, onClose]);

  const handleMouseEnter = useCallback(() => {
    if (action.type === 'submenu' && action.submenu && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setSubmenuPosition({
        x: rect.right + 4,
        y: rect.top,
      });
      setSubmenuOpen(true);
    }
  }, [action.type, action.submenu]);

  const handleMouseLeave = useCallback(() => {
    if (action.type === 'submenu') {
      setSubmenuOpen(false);
    }
  }, [action.type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node) &&
        !itemRef.current?.contains(event.target as Node)
      ) {
        setSubmenuOpen(false);
      }
    };

    if (submenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [submenuOpen]);

  if (action.type === 'separator') {
    return <div className="my-1 border-t border-gray-200" />;
  }

  const getIcon = () => {
    if (action.type === 'checkbox') {
      return action.checked ? (
        <Check className="w-4 h-4 text-blue-600" />
      ) : (
        <Square className="w-4 h-4 text-gray-400" />
      );
    }
    if (action.type === 'radio') {
      return action.checked ? (
        <Circle className="w-4 h-4 text-blue-600 fill-current" />
      ) : (
        <Circle className="w-4 h-4 text-gray-400" />
      );
    }
    return action.icon;
  };

  return (
    <>
      <div
        ref={itemRef}
        className={`
          group flex items-center justify-between px-3 py-2 text-sm cursor-pointer
          fey-transition rounded-md mx-1
          ${action.disabled
            ? 'text-gray-400 cursor-not-allowed opacity-50'
            : action.destructive
              ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
          ${level > 0 ? 'ml-2' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {getIcon() && (
            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
              {getIcon()}
            </div>
          )}
          <span className="truncate">{action.label}</span>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {action.shortcut && (
            <kbd className="
              px-2 py-0.5 text-xs font-mono bg-gray-100
              text-gray-600 rounded border border-gray-200
            ">
              {action.shortcut}
            </kbd>
          )}
          {action.type === 'submenu' && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Submenu */}
      {action.type === 'submenu' && action.submenu && submenuOpen && (
        <div
          ref={submenuRef}
          className="
            fixed z-50 min-w-48 bg-white border border-gray-200
            rounded-lg fey-shadow-lg py-2
            animate-in fade-in-0 zoom-in-95 duration-200
          "
          style={{
            left: submenuPosition.x,
            top: submenuPosition.y,
          }}
        >
          {action.submenu.map((subAction, index) => (
            <FeyMenuItem
              key={`${subAction.id}-${index}`}
              action={subAction}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
});

export const FeyContextMenu = memo<FeyContextMenuProps>(({
  actions,
  trigger,
  placement = 'bottom-start',
  closeOnAction = true,
  className = '',
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const { x, y } = calculateMenuPosition(rect, placement);
      setMenuPosition({ x, y });
    }

    const newOpen = !isOpen;
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [isOpen, placement, onOpenChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const calculateMenuPosition = useCallback((
    triggerRect: DOMRect,
    placement: FeyContextMenuProps['placement']
  ) => {
    const menuWidth = 200; // Approximate menu width
    const menuHeight = 300; // Approximate menu height

    let x = triggerRect.left;
    let y = triggerRect.bottom + 4;

    switch (placement) {
      case 'bottom-start':
        x = triggerRect.left;
        y = triggerRect.bottom + 4;
        break;
      case 'bottom-end':
        x = triggerRect.right - menuWidth;
        y = triggerRect.bottom + 4;
        break;
      case 'top-start':
        x = triggerRect.left;
        y = triggerRect.top - menuHeight - 4;
        break;
      case 'top-end':
        x = triggerRect.right - menuWidth;
        y = triggerRect.top - menuHeight - 4;
        break;
      case 'right-start':
        x = triggerRect.right + 4;
        y = triggerRect.top;
        break;
      case 'left-start':
        x = triggerRect.left - menuWidth - 4;
        y = triggerRect.top;
        break;
    }

    // Ensure menu stays within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - menuWidth - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - menuHeight - padding));

    return { x, y };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleClose]);

  const filteredActions = useMemo(() => {
    return actions.filter(action => action.id !== 'separator' || actions.length > 1);
  }, [actions]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={`fey-context-menu-trigger ${className}`}
      >
        {trigger}
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={handleClose}
          />

          {/* Menu */}
          <div
            ref={menuRef}
            className="
              fixed z-50 min-w-48 max-w-80 bg-white border border-gray-200
              rounded-lg fey-shadow-lg py-2 max-h-80 overflow-y-auto
              animate-in fade-in-0 zoom-in-95 duration-200
            "
            style={{
              left: menuPosition.x,
              top: menuPosition.y,
            }}
          >
            {filteredActions.map((action, index) => (
              <FeyMenuItem
                key={`${action.id}-${index}`}
                action={action}
                onClose={closeOnAction ? handleClose : () => {}}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
});

// Utility component for quick context menus
export const FeyQuickMenu = memo<{
  trigger?: React.ReactNode;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  customActions?: FeyMenuAction[];
  placement?: FeyContextMenuProps['placement'];
}>(({
  trigger,
  onEdit,
  onDuplicate,
  onDelete,
  onShare,
  customActions = [],
  placement = 'bottom-start',
}) => {
  const defaultActions: FeyMenuAction[] = [
    ...(onEdit ? [{
      id: 'edit',
      label: 'Edit',
      shortcut: '⌘E',
      onClick: onEdit,
    }] : []),
    ...(onDuplicate ? [{
      id: 'duplicate',
      label: 'Duplicate',
      shortcut: '⌘D',
      onClick: onDuplicate,
    }] : []),
    ...(onShare ? [{
      id: 'share',
      label: 'Share',
      onClick: onShare,
    }] : []),
    ...customActions,
    ...(onDelete ? [
      { id: 'separator-1', type: 'separator' as const },
      {
        id: 'delete',
        label: 'Delete',
        destructive: true,
        shortcut: '⌫',
        onClick: onDelete,
      }
    ] : []),
  ];

  return (
    <FeyContextMenu
      actions={defaultActions}
      trigger={trigger || (
        <button className="
          p-1 rounded-md hover:bg-gray-100 fey-transition
          fey-focus-ring opacity-0 group-hover:opacity-100
        ">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      )}
      placement={placement}
    />
  );
});

FeyContextMenu.displayName = 'FeyContextMenu';
FeyMenuItem.displayName = 'FeyMenuItem';
FeyQuickMenu.displayName = 'FeyQuickMenu';

export type { FeyContextMenuProps, FeyMenuAction };
