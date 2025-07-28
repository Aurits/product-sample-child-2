# Style Guide

This document outlines the coding standards and conventions for the Data Source Configuration Manager project.

## Table of Contents

1. [TypeScript Guidelines](#typescript-guidelines)
2. [React Best Practices](#react-best-practices)
3. [CSS/Styling Conventions](#css-styling-conventions)
4. [File Organization](#file-organization)
5. [Naming Conventions](#naming-conventions)
6. [Testing Standards](#testing-standards)
7. [Documentation Requirements](#documentation-requirements)

## TypeScript Guidelines

### Type Definitions

Always use explicit types for function parameters and return values:

```typescript
// ✅ Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Interface vs Type

Use interfaces for object shapes and types for unions/primitives:

```typescript
// Object shapes - use interface
interface User {
  id: string;
  name: string;
  email: string;
}

// Union types - use type
type Status = 'pending' | 'active' | 'inactive';
type ID = string | number;
```

### Generics

Use meaningful generic names:

```typescript
// ✅ Good
interface ApiResponse<TData> {
  data: TData;
  error: string | null;
}

// ❌ Bad
interface ApiResponse<T> {
  data: T;
  error: string | null;
}
```

## React Best Practices

### Component Structure

```typescript
// Standard functional component structure
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentProps } from './types';
import { useComponentLogic } from './hooks';
import styles from './Component.module.css';

export const Component: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  onAction,
  ...rest
}) => {
  // Hooks
  const { t } = useTranslation();
  const { state, handlers } = useComponentLogic();
  
  // Local state
  const [localState, setLocalState] = useState(false);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependency]);
  
  // Handlers
  const handleClick = () => {
    onAction(state.value);
  };
  
  // Render
  return (
    <div className={styles.container} {...rest}>
      {/* Component JSX */}
    </div>
  );
};

Component.displayName = 'Component';
```

### Hooks Usage

Custom hooks should be prefixed with `use`:

```typescript
// ✅ Good
function useDataSource(id: string) {
  // Hook logic
}

// ❌ Bad
function getDataSource(id: string) {
  // Hook logic
}
```

### Props Interface

Always define props interface:

```typescript
interface ButtonProps {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger';
  
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * Button content
   */
  children: React.ReactNode;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
}
```

## CSS/Styling Conventions

### CSS Modules

Use CSS Modules for component styling:

```css
/* Component.module.css */
.container {
  display: flex;
  padding: var(--spacing-md);
}

.title {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.button {
  composes: button from '../../styles/common.module.css';
  background-color: var(--color-primary);
}
```

### CSS Variables

Define theme variables in global CSS:

```css
:root {
  /* Colors */
  --color-primary: #1976d2;
  --color-secondary: #dc004e;
  --color-text-primary: #333;
  --color-text-secondary: #666;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
}
```

### Responsive Design

Use mobile-first approach:

```css
.container {
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-lg);
  }
}
```

## File Organization

### Directory Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── ...
│   └── ...
├── hooks/
│   ├── useAuth.ts
│   ├── useDataSource.ts
│   └── ...
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── types.ts
│   └── ...
└── utils/
    ├── validation.ts
    ├── formatters.ts
    └── ...
```

### File Naming

- Components: PascalCase (e.g., `DataSourceForm.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase with `.types.ts` extension
- Tests: Same name with `.test.ts(x)` extension
- Styles: Same name with `.module.css` extension

## Naming Conventions

### Variables and Functions

```typescript
// Variables - camelCase
const userName = 'John';
const isLoading = false;

// Functions - camelCase
function calculateTotal() {}
const handleSubmit = () => {};

// Constants - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// Enums - PascalCase with UPPER_SNAKE_CASE values
enum Status {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
```

### React Components

```typescript
// Components - PascalCase
export const DataSourceList: React.FC = () => {};

// Props - PascalCase with Props suffix
interface DataSourceListProps {}

// Hooks - camelCase with use prefix
const useDataSources = () => {};
```

## Testing Standards

### Test Structure

```typescript
describe('Component', () => {
  // Setup
  let mockProps: ComponentProps;
  
  beforeEach(() => {
    mockProps = {
      onSubmit: jest.fn(),
      initialValue: 'test'
    };
  });
  
  // Tests grouped by functionality
  describe('rendering', () => {
    it('should render with default props', () => {
      // Test implementation
    });
  });
  
  describe('user interactions', () => {
    it('should call onSubmit when form is submitted', () => {
      // Test implementation
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty data gracefully', () => {
      // Test implementation
    });
  });
});
```

### Test Naming

Use descriptive test names following the pattern: "should [expected behavior] when [condition]"

```typescript
// ✅ Good
it('should display error message when validation fails', () => {});
it('should disable submit button when form is invalid', () => {});

// ❌ Bad
it('test error', () => {});
it('submit button', () => {});
```

## Documentation Requirements

### Component Documentation

Every component should have JSDoc comments:

```typescript
/**
 * DataSourceForm component for creating and editing data source configurations
 * 
 * @example
 * <DataSourceForm
 *   initialValues={dataSource}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 */
export const DataSourceForm: React.FC<DataSourceFormProps> = (props) => {
  // Component implementation
};
```

### Function Documentation

Document complex functions:

```typescript
/**
 * Validates data source configuration
 * 
 * @param config - The configuration to validate
 * @returns Validation result with errors if any
 * 
 * @example
 * const result = validateConfig({ name: '', protocol: 'http' });
 * if (!result.isValid) {
 *   console.log(result.errors);
 * }
 */
function validateConfig(config: DataSourceConfig): ValidationResult {
  // Function implementation
}
```

### README Files

Each major directory should have a README explaining its purpose and contents.

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] All TypeScript errors are resolved
- [ ] Code follows the style guide
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Meaningful commit messages
- [ ] PR description explains changes