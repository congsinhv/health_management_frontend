# VHealth - Health Management Platform

A comprehensive health management platform built with Next.js 15, TypeScript, and modern web technologies. VHealth empowers users to track health metrics, manage personal information, and access AI-powered health assistance through an intuitive web interface.

## ✨ Features

### 🔐 Authentication & Security

- JWT-based authentication with automatic token refresh
- OAuth Google integration for seamless login
- Email verification and password reset flows
- Multi-device session management
- Secure storage of sensitive health data

### 📊 Health Tracking

- Personal health dashboard with real-time metrics
- Weight tracking with historical data visualization
- Health goal setting and progress monitoring
- Medical profile management (conditions, allergies, medications)
- Emergency contact information storage

### 🤖 AI-Powered Assistant

- Interactive chat interface for health-related questions
- Quick response templates for common queries
- Conversation history and context-aware responses
- Personalized health recommendations

### 🎨 Modern UI/UX

- Responsive design optimized for all devices
- Accessible interface following WCAG 2.1 AA standards
- Dark mode support with dynamic theming
- Smooth animations and micro-interactions
- Custom SVG icons and illustrations

## 🚀 Quick Start

### Prerequisites

- **Bun** package manager (recommended)
- **Node.js** 18+ (if not using Bun)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/health_management_frontend.git
   cd health_management_frontend
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=VHealth
   ```

4. **Run the development server**

   ```bash
   bun run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── api/                # API routes
│   └── globals.css         # Global styles
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   ├── features/           # Feature-specific components
│   ├── layout/             # Layout components
│   └── chat/               # Chat functionality
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configurations
├── services/               # API service functions
├── types/                  # TypeScript type definitions
└── styles/                 # Global styles and themes
```

## 🛠️ Technology Stack

### Core Framework

- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5.x** - Type-safe development
- **Bun** - Fast package manager and runtime

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library built on Radix UI
- **Lucide React** - Comprehensive icon library
- **Sass** - CSS preprocessor for component styles

### State Management & Data

- **TanStack Query v5** - Server state management
- **React Hook Form v7** - Form state management with validation
- **Zod v4** - Schema validation
- **Axios** - HTTP client with interceptors

### Development Tools

- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **SVGR** - SVG to React component transformation

## 📝 Available Scripts

```bash
# Development
bun run dev          # Start development server with Turbopack
bun run build        # Build production application
bun run start        # Start production server

# Code Quality
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
bun run format:check # Check code formatting
bun run format:fix   # Format and fix linting issues
```

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Application
NEXT_PUBLIC_APP_NAME=VHealth
NEXT_PUBLIC_APP_VERSION=0.1.0

# Features (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=false
```

### Custom Configuration Files

- `next.config.ts` - Next.js configuration with SVG handling
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - shadcn/ui component configuration
- `tsconfig.json` - TypeScript configuration with strict mode

## 🏗️ Architecture Highlights

### Authentication System

- **JWT tokens**: Access tokens (15 min) + Refresh tokens (7 days)
- **Automatic refresh**: Seamless token rotation with request queuing
- **OAuth integration**: Google SSO support
- **Protected routes**: HOC pattern with automatic redirects

### API Integration

- **Axios interceptors**: Automatic token injection and error handling
- **React Query**: Intelligent caching and background refetching
- **Type safety**: Comprehensive TypeScript definitions
- **Error boundaries**: Graceful error handling and user feedback

### Component Architecture

- **Atomic design**: Organized components (atoms, molecules, organisms)
- **shadcn/ui**: Consistent design system with Radix UI primitives
- **Custom hooks**: Reusable logic separation
- **SCSS modules**: Component-specific styling when needed

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t vhealth-frontend .

# Run container
docker run -p 3000:3000 vhealth-frontend
```

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Project Overview & PDR](docs/project-overview-pdr.md)** - Project requirements and specifications
- **[System Architecture](docs/system-architecture.md)** - Technical architecture and design patterns
- **[Codebase Summary](docs/codebase-summary.md)** - Detailed codebase analysis
- **[Code Standards](docs/code-standards.md)** - Development guidelines and best practices

## 🧪 Development Guidelines

### Code Quality

- All code must pass ESLint and Prettier checks
- TypeScript strict mode is enabled
- Comprehensive type definitions are required
- Component documentation with JSDoc comments

### Git Workflow

- Feature branches: `feature/description`
- Commit format: `type(scope): description`
- Pull requests require code review
- Automated tests run on CI/CD

### Performance

- Code splitting with dynamic imports
- Image optimization with Next.js Image component
- Bundle size monitoring
- Core Web Vitals tracking

## 🔒 Security Considerations

- **Input validation**: All user inputs validated with Zod schemas
- **XSS prevention**: React's built-in protections and content security policy
- **Secure storage**: Sensitive data encrypted in localStorage
- **API security**: JWT authentication with refresh token rotation
- **Environment variables**: No secrets in client-side code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`feature/amazing-feature`)
3. Commit your changes (`feat: add amazing feature`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` directory for comprehensive guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas

## 🗺️ Roadmap

### Phase 1: Foundation ✅

- [x] Authentication system
- [x] User profile management
- [x] Basic health tracking
- [x] Dashboard implementation

### Phase 2: Enhancement 🚧

- [x] AI-powered chat assistant
- [x] Advanced health metrics
- [ ] Mobile responsiveness improvements
- [ ] Data visualization enhancements

### Phase 3: Scaling 📋

- [ ] Advanced analytics and reporting
- [ ] Healthcare provider integration
- [ ] Wearable device synchronization
- [ ] Premium features and subscriptions

---

**Built with ❤️ for better health management**

_Last Updated: November 2025_
