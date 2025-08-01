# Product Sample Child 2 - Application Core

This directory contains the core application code for the Data Source Configuration Manager.

## =� Directory Structure

```
product-sample-child-2/
   docs/                    # Project documentation
      architecture/        # Architecture decisions and system design
      components/          # Component API documentation
      style-guide/         # Code style and conventions
   public/                  # Static assets (images, fonts, etc.)
   src/                     # Application source code
      components/          # React components
      hooks/               # Custom React hooks
      pages/               # Page-level components
      services/            # External service integrations
      store/               # State management (Redux)
      styles/              # Global styles and themes
      utils/               # Utility functions and helpers
   tests/                   # Test suites
       e2e/                 # End-to-end tests
       integration/         # Integration tests
       unit/                # Unit tests
```

## =� Quick Start

1. Navigate to this directory:
```bash
cd product-sample-child-2
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## >� Core Components

### Data Source Components (`src/components/data-sources/`)
- **ConfigurationForm**: Main form for configuring data sources
- **ConnectionTester**: Component for testing data source connections
- **ProtocolSelector**: Protocol selection dropdown with dynamic options

### Common Components (`src/components/common/`)
- **Button**: Styled button component with loading states
- **Input**: Form input with validation
- **Alert**: Notification component for success/error messages
- **Modal**: Reusable modal dialog

### Feature Components (`src/components/features/`)
- **DataSourceList**: Display and manage configured data sources
- **ImportExport**: Bulk import/export functionality
- **QuickConnect**: Quick connection templates

## =� Pages

### Dashboard (`src/pages/Dashboard/`)
Main application dashboard showing data source status and metrics.

### Data Sources (`src/pages/DataSources/`)
Data source management interface with CRUD operations.

### Processing (`src/pages/Processing/`)
Data processing configuration and monitoring.

### Settings (`src/pages/Settings/`)
Application settings and preferences.

## = Services

### API Service (`src/services/api/`)
- REST API client for backend communication
- Request/response interceptors
- Error handling middleware

### Auth Service (`src/services/auth/`)
- Authentication and authorization
- Token management
- User session handling

### WebSocket Service (`src/services/websocket/`)
- Real-time connection management
- Event handling
- Reconnection logic

## <� State Management

### Store Configuration (`src/store/`)
Redux store setup with TypeScript support.

### Slices (`src/store/slices/`)
- **dataSourcesSlice**: Data source state management
- **authSlice**: Authentication state
- **uiSlice**: UI state (modals, notifications, etc.)

### Middleware (`src/store/middleware/`)
- **apiMiddleware**: Handle API calls
- **websocketMiddleware**: WebSocket integration
- **loggerMiddleware**: Action logging in development

## <� Styling

### Global Styles (`src/styles/`)
- **theme.ts**: Material-UI theme configuration
- **globals.css**: Global CSS reset and utilities
- **variables.css**: CSS custom properties

## =� Utilities

### Helper Functions (`src/utils/`)
- **validation.ts**: Form validation utilities
- **formatters.ts**: Data formatting functions
- **constants.ts**: Application constants
- **types.ts**: TypeScript type definitions

## >� Testing

### Unit Tests (`tests/unit/`)
Component and utility function tests using Jest and React Testing Library.

### Integration Tests (`tests/integration/`)
Service and API integration tests.

### E2E Tests (`tests/e2e/`)
End-to-end tests using Cypress or Playwright.

## =� Documentation

Detailed documentation for each module can be found in the `docs/` directory:
- [Architecture Overview](docs/architecture/README.md)
- [Component Guide](docs/components/README.md)
- [Style Guide](docs/style-guide/README.md)

## =' Development

### Code Style
We use ESLint and Prettier for code formatting. Run `npm run lint` to check for issues.

### Type Safety
Full TypeScript support with strict mode enabled. Run `npm run typecheck` for type validation.

### Testing
Run `npm test` to execute the full test suite or use specific commands for different test types.

## =� Build

To create a production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.