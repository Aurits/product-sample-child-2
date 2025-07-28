# Data Source Configuration Manager

A comprehensive React-based application for managing and configuring multiple data source connections with real-time validation and testing capabilities.

## 🚀 Features

- **Multi-Protocol Support**: Configure connections for HTTP/REST, WebSocket, gRPC, and Message Queue protocols
- **Real-time Validation**: Form validation with instant feedback
- **Connection Testing**: Test data source connections before saving
- **Modular Architecture**: Clean separation of concerns with organized component structure
- **Type Safety**: Full TypeScript support throughout the application
- **Comprehensive Testing**: Unit, integration, and E2E test coverage

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn package manager
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/product-sample-child-2.git
cd product-sample-child-2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 🏗️ Project Structure

```
product-sample-child-2/
├── docs/                    # Documentation
│   ├── architecture/        # Architecture decisions and diagrams
│   ├── components/          # Component documentation
│   └── style-guide/         # Coding standards and style guide
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── common/          # Shared components
│   │   ├── data-sources/    # Data source configuration components
│   │   ├── features/        # Feature-specific components
│   │   ├── settings/        # Settings components
│   │   └── visualizations/  # Data visualization components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── Dashboard/       # Dashboard page
│   │   ├── DataSources/     # Data sources management
│   │   ├── Processing/      # Data processing
│   │   └── Settings/        # Application settings
│   ├── services/            # API and external services
│   │   ├── api/             # API client services
│   │   ├── auth/            # Authentication services
│   │   └── websocket/       # WebSocket services
│   ├── store/               # State management
│   │   ├── middleware/      # Redux middleware
│   │   └── slices/          # Redux slices
│   ├── styles/              # Global styles and themes
│   └── utils/               # Utility functions
└── tests/                   # Test suites
    ├── e2e/                 # End-to-end tests
    ├── integration/         # Integration tests
    └── unit/                # Unit tests
```

## 🧩 Key Components

### ConfigurationForm
The main component for configuring data sources. Located in `src/components/data-sources/ConfigurationForm.tsx`.

Features:
- Dynamic form fields based on protocol selection
- Real-time validation
- Connection testing functionality
- Error handling and user feedback

### Protocol-Specific Configurations
- **HTTPConfig**: REST API endpoint configuration
- **WebSocketConfig**: WebSocket connection parameters
- **GRPCConfig**: gRPC service configuration
- **QueueConfig**: Message queue settings

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📊 Implementation Status

### ✅ Completed
- UI mockups and design
- Component structure
- Form validation logic
- API service setup

### 🚧 In Progress
- Protocol configuration forms (80%)
- Connection testing UI (60%)
- Error handling (40%)

### 📝 Planned
- Advanced configuration options
- Bulk import/export functionality
- Comprehensive documentation
- Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [product-sample-meta](https://github.com/your-org/product-sample-meta) - Parent project
- Multi-Source Input Handler (Slice #2) - Parent slice reference

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team at dev@yourcompany.com
- Check the [documentation](./docs) for detailed guides