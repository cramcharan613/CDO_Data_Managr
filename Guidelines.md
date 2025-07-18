# Development Guidelines

## General Guidelines

* Follow a clear folder structure separating components, utilities, and business logic
* Use TypeScript for all new code to ensure type safety
* Keep files focused and small (< 300 lines) - split larger files into modules
* Write self-documenting code with clear variable and function names
* Use absolute imports instead of relative paths when possible
* Implement proper error handling and logging throughout the application
* Follow the principle of single responsibility for functions and components
* Use environment variables for configuration management
* Document complex business logic and important decisions in code comments

## Backend (Python) Guidelines

### Code Style and Structure

* Follow PEP 8 naming conventions: snake_case for functions/variables, PascalCase for classes
* Use type hints extensively with Python's typing module
* Implement proper exception handling with specific exception types
* Use dataclasses or Pydantic models for data validation and serialization
* Keep functions small and focused - aim for single responsibility
* Use async/await for I/O-bound operations

### Data Processing

* Use pandas for data manipulation and analysis
* Implement proper data validation before processing
* Cache expensive computations when appropriate
* Use proper logging for debugging and monitoring
* Implement retry mechanisms for external service calls
* Handle ETF and financial data with appropriate precision (Decimal types)
* Implement proper data quality checks and validation

### Testing

* Write unit tests using pytest
* Use fixtures for test data setup
* Mock external dependencies appropriately
* Aim for high test coverage on business logic
* Implement integration tests for critical paths

## Frontend (TypeScript/React) Guidelines

### Component Structure

* Use functional components with hooks
* Keep components small and focused
* Implement proper prop typing with TypeScript
* Use proper component composition to avoid prop drilling
* Implement error boundaries for fault tolerance

### State Management

* Use React Query for server state management
* Implement proper loading and error states
* Use local state for UI-only concerns
* Implement proper form validation
* Use proper TypeScript types for all state

### Styling

* Use CSS modules for component-specific styles
* Follow responsive design principles
* Implement proper accessibility standards
* Use CSS Grid and Flexbox for layouts
* Maintain consistent spacing and typography

## Design System Guidelines

### Color System

* Primary Color: Blue (#3b82f6) - for main actions and key interactive elements
* Destructive Color: Red (#ef4444) - for errors and destructive actions
* Secondary Color: Slate (#1e293b) - for secondary actions and backgrounds
* Muted Color: Blue-gray (#94a3b8) - for less important text and elements
* Dark Theme: Use the defined CSS custom properties for consistent theming

### Typography

* Base font size: 14px (--font-size: 14px)
* Font weights:
  * Normal: 400 (--font-weight-normal)
  * Medium: 500 (--font-weight-medium)
  * Semibold: 600 (--font-weight-semibold)
* Use system font stack for optimal performance
* Header hierarchy should be consistently maintained

### Spacing & Layout

* Border radius: 0.75rem (--radius) for cards and major components
* Use rounded-md (0.375rem) for smaller elements like buttons
* Use rounded-xl (0.75rem) for cards and containers
* Implement consistent gap spacing using Tailwind classes (gap-1.5, gap-2, gap-6)
* Follow CSS Grid for page layouts, Flexbox for component layouts

### Component Guidelines

#### Button Component

The Button component supports multiple variants and sizes with consistent styling.

##### Variants

* **Default (Primary)**
  * Style: `bg-primary text-primary-foreground hover:bg-primary/90`
  * Usage: Main actions, form submissions, primary CTAs
  * Focus: Blue ring with proper focus-visible states

* **Destructive**
  * Style: Red background with white text, hover states
  * Usage: Delete actions, dangerous operations
  * Focus: Destructive color ring for accessibility

* **Outline**
  * Style: Border with background, hover effects
  * Usage: Secondary actions, toggles
  * Focus: Maintains border styling with enhanced focus states

* **Secondary**
  * Style: Secondary background with appropriate contrast
  * Usage: Supporting actions, less important buttons

* **Ghost**
  * Style: Transparent with hover states
  * Usage: Minimal actions, icon buttons in toolbars

* **Link**
  * Style: Text with underline on hover
  * Usage: Navigation, inline actions

##### Sizes

* **Default**: h-9 px-4 py-2 (with icon adjustments)
* **Small**: h-8 rounded-md gap-1.5 px-3
* **Large**: h-10 rounded-md px-6
* **Icon**: size-9 rounded-md (square buttons for icons)

#### Card Component

Cards use the shadcn/ui pattern with flexible composition.

##### Structure

* **Card**: Base container with border, rounded corners, background
* **CardHeader**: Contains title and description with proper spacing
* **CardTitle**: Semantic h4 element with leading-none
* **CardDescription**: Muted foreground text for supporting information
* **CardContent**: Main content area with consistent padding

##### Styling

* Background: Uses `--card` CSS custom property
* Border: Subtle border using `--border` color
* Spacing: Consistent gap-6 for internal spacing
* Responsive: Uses container queries (@container/card-header)

#### Data Grid Component

Based on the DataGrid.optimized.tsx implementation:

##### Features

* Virtualization for large datasets (useVirtualScrolling hook)
* Performance monitoring (usePerformanceMonitor)
* Sortable columns with visual indicators
* Bulk selection with checkboxes
* Action menus with dropdown patterns
* Status badges with appropriate colors

##### Interaction Patterns

* Hover states for rows
* Clear visual feedback for selections
* Consistent icon usage (Lucide React icons)
* Proper focus management for keyboard navigation

### Icon System

* Use Lucide React icons consistently
* Standard icon sizes: size-4 (16px) for most use cases
* Icon buttons should use size-9 (36px) containers
* Icons should have pointer-events-none and shrink-0 classes
* Use semantic icons (Search, Filter, Download, etc.)

### State Management UI Patterns

* Loading states: Use appropriate spinners and skeletons
* Error states: Use destructive variant styling with clear messaging
* Empty states: Provide helpful guidance and actions
* Success states: Use appropriate success colors and feedback

### Glass Morphism Effects

The design system includes glass morphism variables:

* `--glass-bg: rgba(17, 18, 23, 0.8)` - Semi-transparent backgrounds
* `--glass-border: rgba(148, 163, 184, 0.1)` - Subtle borders
* Use for overlays, modals, and floating elements

### Hover and Active States

* `--hover-bg: rgba(59, 130, 246, 0.1)` - Subtle blue hover
* `--active-bg: rgba(59, 130, 246, 0.2)` - More prominent active state
* Apply consistently across interactive elements

### Focus Management

* Use focus-visible for keyboard navigation
* Ring colors should match the component's primary color
* Ring width: 3px for buttons, 2px for inputs
* Maintain proper focus trap in modals and dropdowns

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines

Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:

## Button

The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage

Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants

* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
