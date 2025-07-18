// Fey UI Design System - Main Export File
// Comprehensive design system implementing sophisticated interaction patterns

// Core Design Tokens
export * from './fey-ui-tokens.css';

// Layout Components
export { FeyCard, type FeyCardProps, type FeyNestedItem } from './FeyCard';
export { FeyGrid, type FeyGridProps, type FeyGridItem } from './FeyGrid';

// Interaction Components
export {
  FeyContextMenu,
  FeyQuickMenu,
  type FeyContextMenuProps,
  type FeyMenuAction
} from './FeyContextMenu';

// Animation Components
export {
  FeyAnimatedContainer,
  FeyHoverEffect,
  FeyFocusRing,
  FeyTransition,
  FeyStaggeredContainer,
  FeyLoadingSpinner,
  type FeyAnimatedContainerProps,
  type FeyHoverEffectProps,
  type FeyFocusRingProps,
  type FeyTransitionProps,
} from './FeyAnimations';

// Design System Constants
export const FEY_DESIGN_TOKENS = {
  // Elevation levels
  ELEVATION: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
    XXL: '2xl',
  } as const,

  // Animation durations
  DURATION: {
    FAST: 'fast',
    NORMAL: 'normal',
    SLOW: 'slow',
    SLOWER: 'slower',
  } as const,

  // Grid columns
  GRID_COLUMNS: {
    DEFAULT: { default: 3, sm: 1, md: 2, lg: 3, xl: 4 },
    COMPACT: { default: 2, sm: 1, md: 2, lg: 4, xl: 6 },
    SPACIOUS: { default: 1, sm: 1, md: 1, lg: 2, xl: 3 },
  } as const,

  // Hover effects
  HOVER_EFFECTS: {
    LIFT: 'lift',
    GLOW: 'glow',
    SCALE: 'scale',
    FLOAT: 'float',
    TILT: 'tilt',
    PULSE: 'pulse',
  } as const,

  // Focus variants
  FOCUS_VARIANTS: {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
  } as const,
} as const;

// Utility type for design token values
export type FeyDesignToken<T> = T[keyof T];

// Re-export design token types
export type FeyElevation = FeyDesignToken<typeof FEY_DESIGN_TOKENS.ELEVATION>;
export type FeyDuration = FeyDesignToken<typeof FEY_DESIGN_TOKENS.DURATION>;
export type FeyHoverEffect = FeyDesignToken<typeof FEY_DESIGN_TOKENS.HOVER_EFFECTS>;
export type FeyFocusVariant = FeyDesignToken<typeof FEY_DESIGN_TOKENS.FOCUS_VARIANTS>;

// Utility functions for design system
export const createFeyGridItem = (
  id: string,
  component: React.ReactNode,
  options?: {
    span?: { cols?: number; rows?: number };
    order?: number;
    breakpoints?: FeyGridItem['breakpoints'];
  }
): FeyGridItem => ({
  id,
  component,
  ...options,
});

export const createFeyNestedItem = (
  id: string,
  title: string,
  options?: {
    subtitle?: string;
    content?: React.ReactNode;
    children?: FeyNestedItem[];
    metadata?: Record<string, any>;
    actions?: React.ReactNode;
  }
): FeyNestedItem => ({
  id,
  title,
  ...options,
});

export const createFeyMenuAction = (
  id: string,
  label: string,
  options?: {
    icon?: React.ReactNode;
    shortcut?: string;
    disabled?: boolean;
    destructive?: boolean;
    checked?: boolean;
    type?: FeyMenuAction['type'];
    submenu?: FeyMenuAction[];
    onClick?: () => void;
  }
): FeyMenuAction => ({
  id,
  label,
  ...options,
});

// Design system documentation metadata
export const FEY_UI_METADATA = {
  version: '1.0.0',
  description: 'Sophisticated design system with minimalist aesthetic and advanced interaction patterns',
  features: [
    'Hybrid grid-card layout architecture',
    'Dynamic nested list components',
    'Contextual menu systems with sophisticated interactions',
    'Micro-animations for hover states and transitions',
    'Layered elevation system with subtle shadow gradients',
    'Responsive component behaviors across viewports',
    'Clean typography hierarchies with proper spacing',
  ],
  components: {
    layout: ['FeyCard', 'FeyGrid'],
    interaction: ['FeyContextMenu', 'FeyQuickMenu'],
    animation: [
      'FeyAnimatedContainer',
      'FeyHoverEffect',
      'FeyFocusRing',
      'FeyTransition',
      'FeyStaggeredContainer',
      'FeyLoadingSpinner',
    ],
  },
  designPrinciples: [
    'Minimalist design with sophisticated depth',
    'Smooth micro-interactions and state transitions',
    'Consistent visual hierarchy and spacing',
    'Accessible and keyboard navigable',
    'Performance optimized with React.memo',
    'Mobile-first responsive design',
  ],
} as const;

export default {
  // Components
  FeyCard,
  FeyGrid,
  FeyContextMenu,
  FeyQuickMenu,
  FeyAnimatedContainer,
  FeyHoverEffect,
  FeyFocusRing,
  FeyTransition,
  FeyStaggeredContainer,
  FeyLoadingSpinner,

  // Constants
  TOKENS: FEY_DESIGN_TOKENS,
  METADATA: FEY_UI_METADATA,

  // Utils
  createFeyGridItem,
  createFeyNestedItem,
  createFeyMenuAction,
};
