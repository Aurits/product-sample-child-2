# Product Sample Child 2 - Frontend Application

## Overview

A modern, scalable React-based frontend application showcasing best practices for building enterprise-grade web applications. This project demonstrates advanced state management, real-time data handling, and comprehensive testing strategies.

## Features

- **Modern React Architecture**: Built with React 18+, TypeScript, and modern tooling
- **State Management**: Redux Toolkit for predictable state management
- **Real-time Capabilities**: WebSocket integration for live data updates
- **Multi-Protocol Support**: Configure connections for HTTP/REST, WebSocket, gRPC, and Message Queue protocols
- **Component Library**: Reusable UI components with proper documentation
- **Type Safety**: Full TypeScript coverage with strict mode
- **Testing Strategy**: Comprehensive unit, integration, and E2E tests
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundles
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theming System**: Dynamic theme switching with CSS-in-JS

## Prerequisites

- Node.js 18.0.0 or higher
- npm 8+ or yarn 1.22+
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product-sample-child-2
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
product-sample-child-2/
├── docs/                    # Documentation
│   ├── architecture/        # Architecture decisions and diagrams
│   │   ├── README.md       # Architecture overview
│   │   └── data-flow.md    # Data flow documentation
│   ├── components/          # Component documentation
│   │   └── data-sources/   # Data source component docs
│   └── style-guide/        # Coding standards and style guide
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── common/         # Shared/reusable components
│   │   │   └── Button/     # Example component structure
│   │   ├── data-sources/   # Data source management
│   │   ├── features/       # Feature-specific components
│   │   ├── settings/       # Settings components
│   │   └── visualizations/ # Data visualization components
│   ├── hooks/              # Custom React hooks
│   │   ├── useDataSources.ts
│   │   └── useWebSocket.ts
│   ├── pages/              # Page components (routes)
│   │   ├── Dashboard/      # Dashboard page
│   │   ├── DataSources/    # Data sources management
│   │   ├── Processing/     # Data processing
│   │   └── Settings/       # Application settings
│   ├── services/           # External service integrations
│   │   ├── api/           # REST API client
│   │   ├── auth/          # Authentication services
│   │   └── websocket/     # WebSocket client
│   ├── store/             # Redux store configuration
│   │   ├── middleware/    # Custom middleware
│   │   └── slices/        # Feature slices
│   ├── styles/            # Global styles and themes
│   │   ├── globals.css    # Global CSS
│   │   └── theme.ts       # Theme configuration
│   └── utils/             # Utility functions
│       ├── formatters.ts  # Data formatters
│       └── validation.ts  # Validation helpers
└── tests/                 # Test suites
    ├── e2e/              # End-to-end tests
    ├── integration/      # Integration tests
    └── unit/             # Unit tests
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run all tests
npm run test:unit       # Run unit tests only
npm run test:integration # Run integration tests
npm run test:e2e        # Run E2E tests
npm run test:coverage   # Generate coverage report

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format with Prettier
npm run typecheck       # Run TypeScript compiler

# Analysis
npm run analyze         # Analyze bundle size
npm run lighthouse      # Run Lighthouse audit
```

### Code Style

We follow strict coding standards:
- ESLint with custom React/TypeScript configuration
- Prettier for code formatting
- Husky for pre-commit hooks
- Conventional commits for version control

### Component Development

Components follow a consistent structure:
```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.test.tsx # Unit tests
├── ComponentName.stories.tsx # Storybook stories
├── types.ts              # TypeScript types
├── styles.ts             # Styled components
└── index.ts              # Public exports
```

## Architecture

### State Management

We use Redux Toolkit for state management:
- **Slices**: Feature-based state organization
- **RTK Query**: For API data fetching and caching
- **Middleware**: Custom middleware for logging and analytics
- **DevTools**: Full Redux DevTools integration

### Data Flow

1. **User Action** → Component dispatches action
2. **Middleware** → Process action (logging, analytics)
3. **Reducer** → Update state immutably
4. **Selector** → Components select required state
5. **Re-render** → UI updates with new state

### API Integration

- RESTful API client with axios
- Automatic request/response interceptors
- Token refresh mechanism
- Request cancellation support
- Error boundary integration

## Testing

### Testing Strategy

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Testing API interactions
- **E2E Tests**: Cypress for user flow testing
- **Visual Regression**: Storybook + Chromatic

### Running Tests

```bash
# Run all tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test Button.test.tsx

# Run E2E tests
npm run cypress:open
```

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run preview
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:3001 |
| `VITE_WS_URL` | WebSocket server URL | ws://localhost:3001 |
| `VITE_AUTH_DOMAIN` | Auth0 domain | - |
| `VITE_AUTH_CLIENT_ID` | Auth0 client ID | - |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | false |

### Deployment Platforms

The application is configured for deployment on:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Docker containers

## Performance

### Optimization Techniques

- Code splitting at route level
- Lazy loading for heavy components
- Image optimization with next-gen formats
- Service worker for offline support
- Bundle size monitoring
- React.memo for expensive renders

### Monitoring

- Web Vitals tracking
- Error boundary reporting
- Performance budgets
- Lighthouse CI integration

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process/auxiliary tool changes

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Module not found errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Restart TS server in VSCode
   Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
   ```

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/product-sample-child-2/issues)
- Documentation: Check `/docs` directory
- Email: support@example.com

## Acknowledgments

- React team for the amazing framework
- Redux team for state management solution
- All contributors who have helped shape this project