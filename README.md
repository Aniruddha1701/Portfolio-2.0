<div align="center">

<img src="public/logo-banner.png" alt="Portfolio 2.0 Banner" width="100%">

# 🚀 Portfolio 2.0

**Next-Generation Full-Stack Portfolio Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://your-portfolio.com) • [Documentation](#-documentation) • [Get Started](#-quick-start) • [Contributing](#-contributing)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Aniruddha1701/Portfolio-2.0)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Features Deep Dive](#-features-deep-dive)
- [Admin Dashboard](#-admin-dashboard)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Security](#-security)
- [Customization](#-customization)
- [Testing](#-testing)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

**Portfolio 2.0** is a cutting-edge, full-stack portfolio application that combines stunning visual design with powerful functionality. Built on modern web technologies, it features AI-powered content curation, real-time management capabilities, enterprise-grade security, and exceptional performance optimization.

### Design Philosophy

The platform is built on five fundamental principles:

🎨 **Modern Aesthetics** - Contemporary design patterns including glassmorphism, fluid animations, and particle effects create an immersive, memorable user experience.

⚡ **Performance First** - Every component is optimized for speed, achieving 95+ Lighthouse scores through careful attention to bundle sizes, lazy loading, and efficient rendering.

♿ **Universal Accessibility** - WCAG 2.1 AAA compliance ensures all users can access content regardless of abilities or devices used.

🔐 **Enterprise Security** - Multi-layered security architecture including JWT authentication, OTP verification, rate limiting, and comprehensive input validation.

🎯 **Developer Experience** - Intuitive structure, comprehensive documentation, and modern tooling make customization and extension straightforward.

### What Makes This Different

**AI Integration** - Google Gemini AI powers intelligent features including automated news curation, content generation, and smart recommendations.

**Advanced Animations** - Sophisticated animation system using Framer Motion creates fluid transitions, particle effects, and interactive elements responding to user behavior.

**Real-Time Management** - Custom admin dashboard enables instant content updates without deployments, supporting rapid iteration and fresh content.

**Progressive Web App** - Full PWA capabilities transform the website into an installable application with offline support and native-like performance.

**Interactive Features** - Terminal interface, code playground, and technical demos showcase skills while providing engaging visitor experiences.

---

## ✨ Key Features

### 🎭 Visual Excellence

<table>
<tr>
<td width="50%">

#### 🎨 Design Components

**Particle Background System**
- Canvas-based animation engine
- Mouse interaction and physics
- Collision detection algorithms
- Dynamic color interpolation
- Performance-optimized rendering

**Glassmorphism Effects**
- Frosted glass aesthetics
- Backdrop blur filters
- Layered depth perception
- Subtle transparency effects
- Context-aware styling

**Custom Cursor**
- State-aware transformations
- Smooth transition animations
- Hover state variations
- Click feedback indicators
- Accessibility preservation

</td>
<td width="50%">

#### ⚡ Animation Features

**Micro-interactions**
- Button press animations
- Form input feedback
- Card hover effects
- Navigation transitions
- Loading state indicators

**Scroll Animations**
- Intersection observer triggers
- Content reveal effects
- Parallax scrolling
- Progress indicators
- Stagger animations

**Page Transitions**
- Route change animations
- Exit/enter sequences
- Shared element transitions
- Loading state management
- History preservation

</td>
</tr>
</table>

### 🎯 Core Functionality

#### Personal Branding

**Hero Section** - Dynamic introduction with typewriter effects, animated backgrounds, social proof elements, and strategic call-to-action placement.

**About Module** - Interactive timeline showcasing education and experience with expandable details, achievements, and rich media integration.

**Skills Display** - Categorized technical competencies with visual proficiency indicators, related projects, and experience levels.

**Project Showcase** - Portfolio items presented as interactive cards with comprehensive details, technology stacks, live demos, and source code links.

### 🤖 AI-Powered Features

#### Smart Lab - News Aggregation

**Multi-Source Collection**
- RSS feed integration
- API endpoint aggregation
- Web scraping capabilities
- Real-time updates
- Source diversity

**AI Processing**
- Content summarization
- Topic extraction
- Sentiment analysis
- Relevance scoring
- Quality filtering

**Smart Features**
- Automatic categorization
- Duplicate detection
- Trend identification
- Personalized recommendations
- Bookmark management

### 🔐 Admin Dashboard

#### Management Capabilities

**Content Operations**
- Complete CRUD functionality
- Drag-and-drop reordering
- Bulk action support
- Draft system
- Version control

**Media Management**
- Image optimization
- File upload handling
- Gallery organization
- Format conversion
- Storage management

**Analytics Dashboard**
- Visitor statistics
- Engagement metrics
- Traffic sources
- Popular content
- Real-time updates

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Purpose | Key Benefits |
|------------|---------|--------------|
| **Next.js 15** | React Framework | SSR, SSG, API Routes, App Router, Performance |
| **React 19** | UI Library | Concurrent Rendering, Automatic Batching, Transitions |
| **TypeScript 5** | Type Safety | Error Prevention, IntelliSense, Refactoring Support |
| **Tailwind CSS** | Styling | Utility-First, Responsive, Dark Mode, Customization |
| **Framer Motion** | Animations | Declarative API, Spring Physics, Gesture Support |
| **Shadcn/ui** | Components | Accessibility, Customization, Modern Design |

### Backend Infrastructure

| Technology | Purpose | Key Benefits |
|------------|---------|--------------|
| **MongoDB** | Database | Flexible Schema, Performance, Scalability, JSON-like |
| **Mongoose** | ODM | Schema Validation, Middleware, Type Safety, Queries |
| **JWT** | Authentication | Stateless, Scalable, Secure, Standard |
| **Nodemailer** | Email Service | SMTP Support, Templates, Attachments, HTML Email |

### AI & Integrations

| Service | Purpose | Capabilities |
|---------|---------|--------------|
| **Google Gemini** | AI Model | Content Generation, Summarization, Analysis |
| **Genkit** | AI Framework | Flow Orchestration, Caching, Error Handling |
| **Chart.js** | Visualization | Interactive Charts, Responsive, Customizable |

---

## 🏗️ Architecture

### System Design

The application follows a modern layered architecture:

**Presentation Layer** - React components handle UI rendering and user interactions. State management uses hooks and Context API for global state.

**Application Layer** - Business logic orchestrates data flow. Server Actions provide type-safe mutations while API routes handle RESTful operations.

**Data Access Layer** - Mongoose models abstract database operations with schema validation, hooks, and query optimization.

**External Services** - Third-party integrations managed through service abstractions enabling easy provider switching.

### Data Flow

User actions trigger frontend validation before API requests. Server-side processing includes authentication verification, schema validation, business logic execution, and database operations. Responses follow consistent format with success/error indicators.

### Security Architecture

**Authentication** - Multi-factor approach using email OTP and JWT tokens. Secure httpOnly cookies prevent XSS attacks.

**Authorization** - Role-based access control with resource-level permissions. Audit logging tracks all administrative actions.

**Input Validation** - Client and server-side validation using Zod schemas. Type checking and format validation prevent invalid data.

**Data Protection** - Encryption at rest and in transit. TLS certificates validate server identity and secure communications.

---

## 🚀 Quick Start

Get up and running in minutes:

1. **Clone Repository** - Download complete codebase with Git
2. **Install Dependencies** - NPM resolves and installs required packages
3. **Configure Environment** - Set up database, email, and API credentials
4. **Initialize Database** - Create admin user and optional sample data
5. **Start Development** - Launch local server with hot reload

Open `http://localhost:9002` and you're ready!

---

## 📖 Installation

### Prerequisites

- **Node.js 18+** - JavaScript runtime environment
- **MongoDB** - Database (local or Atlas cloud)
- **Gmail Account** - SMTP email service
- **Google AI Key** - Optional for AI features

### Environment Setup

Create `.env.local` with required variables:

**Database Configuration** - MongoDB connection URI with authentication credentials

**Email Settings** - SMTP host, port, credentials for sending emails via Gmail

**Security Keys** - JWT secret for token signing (minimum 32 characters)

**Application Settings** - URLs, ports, feature flags, and optional integrations

### Database Initialization

Run setup scripts to create collections, indexes, and admin user. Optional scripts add sample data demonstrating full functionality.

### Development Server

Start Next.js development server with fast refresh enabled. Changes automatically rebuild and update browser without losing state.

---

## ⚙️ Configuration

### Security Configuration

**Authentication Parameters** - Token lifetime, cookie options, refresh intervals, and session duration

**OTP Settings** - Code length, expiration time, maximum retry attempts, and delivery method

**Rate Limiting** - Request frequency limits per endpoint, IP-based tracking, and automatic blocking

**CORS Policy** - Allowed origins, credentials mode, exposed headers, and preflight caching

### Email Configuration

**SMTP Settings** - Server connection details, authentication method, and secure connection options

**Template System** - HTML email templates for OTP, contacts, and notifications

**Delivery Options** - Retry logic, bounce handling, and status tracking

### AI Configuration

**Model Selection** - Choose specific AI models for different tasks balancing capability vs cost

**Request Parameters** - Temperature, max tokens, response format, and behavior controls

**Caching Strategy** - Response caching duration, invalidation rules, and storage location

### Performance Tuning

**Caching Policies** - Browser, CDN, and server caching with appropriate expiration

**Image Optimization** - Quality settings, format preferences, and responsive sizing

**Build Settings** - Code splitting, minification, tree shaking, and compression

---

## 🎯 Features Deep Dive

### Animation System

**Spring Physics** - Natural motion following physics principles with configurable stiffness and damping

**Gesture Recognition** - Touch and mouse gesture support for drag, swipe, and pinch interactions

**Scroll Animations** - Content reveals triggered by scroll position using Intersection Observer

**Layout Transitions** - Smooth position changes with shared element transitions between routes

### Theme System

**Color Schemes** - Dark and light modes with automatic system preference detection

**CSS Variables** - Dynamic theming through custom properties enabling runtime color changes

**Accessibility** - WCAG-compliant contrast ratios and clear focus indicators

### Interactive Terminal

**Command System** - Navigation, information, and fun commands with history and auto-completion

**Multi-line Support** - Complex commands across multiple lines with proper parsing

**Easter Eggs** - Hidden commands and surprises rewarding exploration

### Smart Lab

**Content Aggregation** - Multiple source collection including RSS, APIs, and web scraping

**AI Processing** - Intelligent summarization, categorization, and relevance scoring

**User Features** - Search, filters, bookmarks, and personalized recommendations

---

## 🔐 Admin Dashboard

### Dashboard Design

**Glassmorphism Interface** - Modern frosted glass aesthetic with layered depth and blur effects

**Responsive Layouts** - Adaptive grid system flowing from multi-column desktop to single-column mobile

**Data Visualization** - Interactive charts displaying analytics with real-time updates

### Authentication Flow

**OTP Verification** - Email-based one-time passwords provide secure multi-factor authentication

**JWT Tokens** - Stateless authentication with automatic expiration and refresh capabilities

**Session Management** - Active session tracking with remote termination support

### Content Management

**Skills Administration** - CRUD operations with categorization, proficiency levels, and reordering

**Project Management** - Rich editing with galleries, tags, URLs, and detailed descriptions

**Journey Timeline** - Visual editor for education and work experience with achievements

**Message Center** - Unified inbox for contact submissions with filtering and quick actions

---

## 📡 API Documentation

### API Design

**RESTful Principles** - Resource-oriented URLs with standard HTTP methods

**Consistent Responses** - Uniform structure with success status, data payload, and errors

**Comprehensive Errors** - Clear messages, codes, and actionable suggestions

**Versioning** - URL-based versioning enabling breaking changes without affecting existing clients

### Endpoint Categories

**Public Endpoints** - Portfolio data and contact submission without authentication

**Authenticated Endpoints** - Content management requiring valid JWT tokens

**Admin Endpoints** - User management, configuration, and backups restricted to administrators

### Security Measures

**Token Authentication** - Bearer tokens in Authorization headers identify requests

**Input Validation** - Schema validation using Zod with type checking and business rules

**Rate Limiting** - Frequency limits prevent abuse ensuring fair resource allocation

**CORS Control** - Whitelist or wildcard policies with credential protection

---

## 🚀 Deployment

### Platform Options

**Vercel (Recommended)** - Zero-configuration Next.js deployment with automatic builds, global CDN, and preview deployments

**Docker Containers** - Consistent environments across development and production with easy scaling

**Traditional Hosting** - VPS deployment with full control over configuration and resources

### Deployment Workflow

**Pre-Deployment** - Environment preparation, database migration, comprehensive testing, and security audit

**Build Phase** - TypeScript compilation, JavaScript bundling, image optimization, and static generation

**Deploy Phase** - Asset transfer using appropriate strategy (blue-green, canary, direct)

**Post-Deployment** - Monitoring setup, DNS configuration, SSL installation, and performance optimization

### Platform-Specific Guides

**Vercel Steps** - Repository import, environment variable configuration, automatic deployment

**Docker Setup** - Image building, container running, compose orchestration, and volume management

**VPS Configuration** - Server provisioning, software installation, reverse proxy setup, and SSL

---

## ⚡ Performance

### Performance Metrics

**Core Web Vitals** - LCP under 2.5s, FID under 100ms, CLS under 0.1

**Load Times** - First Contentful Paint, Time to Interactive, Speed Index optimization

**Resource Efficiency** - Bundle size minimization, image optimization, efficient caching

### Optimization Techniques

**Code Splitting** - Route-based and component-level splitting loads only necessary code

**Lazy Loading** - Deferred resource loading for images, components, and routes

**Compression** - Gzip and Brotli compression dramatically reduce transfer sizes

**CDN Delivery** - Geographic distribution reduces latency through edge caching

### Image Optimization

**Format Selection** - Modern WebP format with fallbacks for compatibility

**Responsive Images** - Device-appropriate sizing prevents bandwidth waste

**Lazy Loading** - Below-fold images load on scroll improving initial page load

**Optimization Pipeline** - Automatic resizing, compression, and format conversion

---

## 🔒 Security

### Security Layers

**Application Security** - Input validation, output encoding, injection prevention, CSRF protection

**Authentication Security** - Password hashing, token expiration, brute force prevention, MFA

**Data Protection** - Encryption at rest and transit, data minimization, access control

**Infrastructure Security** - Security headers, dependency management, error handling, audit logging

### Best Practices

**Input Validation** - Whitelist validation accepting only known-good patterns

**Session Security** - Secure httpOnly cookies with appropriate SameSite attributes

**Dependency Management** - Regular updates addressing vulnerabilities with automated scanning

**Audit Logging** - Security-relevant events logged for analysis and compliance

---

## 🎨 Customization

### Theme Customization

**Color System** - Primary, semantic, and neutral colors with dark mode variants

**Typography** - Font selection, type scale, line height, and spacing adjustments

**Component Styles** - Variant systems enabling multiple appearances per component

### Feature Customization

**Feature Flags** - Enable/disable features through configuration

**Content Customization** - All text and media can be replaced

**Behavior Adjustments** - Animation speeds, transition styles, and interaction patterns

### Extension Points

**Custom Components** - Plugin system for adding new components

**API Extensions** - Additional endpoints following existing patterns

**Theme Extensions** - Custom themes packaged for reuse

---

## 🧪 Testing

### Testing Strategy

**Unit Tests** - Component, function, and hook testing in isolation

**Integration Tests** - API, feature, and database testing with dependencies

**End-to-End Tests** - Complete user flow testing across browsers and devices

### Testing Tools

**Jest** - Test runner with assertions and mocking capabilities

**React Testing Library** - Component testing emphasizing user interactions

**Playwright** - Cross-browser end-to-end testing with headless mode

---

## 💡 Best Practices

### Code Quality

- Consistent formatting with automated tools
- Meaningful names documenting intent
- Small, focused functions doing one thing well
- Full TypeScript type safety
- Comprehensive documentation

### Architecture

- Clear separation of concerns
- DRY principle balanced with readability
- Single responsibility principle
- Dependency injection for testability

### Performance

- Lazy loading for deferred resource loading
- Memoization caching expensive computations
- Debouncing limiting operation frequency
- Pagination for large datasets

---

## 🤝 Contributing

### Contribution Process

1. **Fork Repository** - Create personal copy for experimentation
2. **Create Branch** - Feature branches isolate work
3. **Make Changes** - Implement following project conventions
4. **Write Tests** - Cover new functionality
5. **Submit PR** - Describe changes and provide testing instructions

### Guidelines

- Follow existing code style
- Write comprehensive tests
- Update documentation
- Maintain backwards compatibility

---

## 🗺️ Roadmap

### Version 2.1 (Q2 2026)
- Enhanced analytics dashboard
- Blog integration with Markdown
- Multi-language support
- Advanced search functionality

### Version 2.2 (Q3 2026)
- Real-time collaboration
- Content version control
- Public API with GraphQL
- Native mobile applications

### Version 3.0 (Q4 2026)
- Headless CMS mode
- Theme marketplace
- Advanced AI features
- White label multi-tenancy

---

## ❓ FAQ

**Q: Suitable for production?**
A: Yes, includes enterprise security, performance optimization, and thorough testing.

**Q: Can I customize completely?**
A: Yes, theming system allows visual customization; all components are modifiable.

**Q: What are hosting costs?**
A: Free tiers available for MongoDB Atlas, Vercel, and Google AI.

**Q: Maintenance difficulty?**
A: Admin dashboard enables non-technical content updates; code updates are infrequent.

---

## 📄 License

MIT License - Use commercially, modify, distribute, and use privately with minimal restrictions.

---

## 🙏 Acknowledgments

Built with amazing technologies: Next.js • MongoDB • Tailwind CSS • Framer Motion • Google Gemini

Special thanks to the open-source community and all contributors making this possible.

---

## 📞 Support

**GitHub Issues** - Bug reports and feature requests

**GitHub Discussions** - Community Q&A and conversations

**Documentation** - Comprehensive guides and tutorials

**Email** - Direct support for sensitive inquiries

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by [Aniruddha](https://github.com/Aniruddha1701)**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=Aniruddha1701.Portfolio-2.0)
![GitHub stars](https://img.shields.io/github/stars/Aniruddha1701/Portfolio-2.0?style=social)
![GitHub forks](https://img.shields.io/github/forks/Aniruddha1701/Portfolio-2.0?style=social)

[Get Started](#-quick-start) • [Documentation](#-table-of-contents) • [Community](https://github.com/Aniruddha1701/Portfolio-2.0/discussions)

</div>
