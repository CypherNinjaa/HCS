# GitHub Copilot Custom Instructions for Happy Child School Project

## Project Overview

This is a comprehensive school management system with multiple user roles (students, parents,
teachers, admins) requiring the highest security standards and robust architecture.

## Core Technology Stack Rules

### Frontend Framework Rules

- **ALWAYS** use Next.js 14+ with App Router (no Pages Router)
- **ALWAYS** use TypeScript with strict mode enabled
- **NEVER** use JavaScript files - everything must be TypeScript
- **ALWAYS** use Server Components by default, Client Components only when necessary
- **ALWAYS** implement proper error boundaries for each major component

### Authentication & Security Rules

- **ALWAYS** implement role-based access control (RBAC) for every route and API endpoint
- **NEVER** store sensitive data in localStorage or sessionStorage
- **ALWAYS** validate user permissions on both client and server side
- **ALWAYS** use Supabase RLS (Row Level Security) policies
- **ALWAYS** implement CSRF protection for forms
- **ALWAYS** sanitize all user inputs before database operations
- **NEVER** expose API keys or secrets in client-side code
- **ALWAYS** use environment variables for all configuration
- **ALWAYS** implement rate limiting on API routes
- **ALWAYS** hash passwords with bcrypt (minimum 12 rounds)
- **ALWAYS** implement session timeout and auto-logout

### Database & Data Handling Rules

- **ALWAYS** use prepared statements/parameterized queries
- **NEVER** use string concatenation for SQL queries
- **ALWAYS** implement data validation using Zod schemas
- **ALWAYS** implement soft deletes for sensitive data (students, teachers)
- **ALWAYS** create database backups before major operations
- **ALWAYS** implement audit trails for admin actions
- **ALWAYS** use transactions for multi-table operations
- **NEVER** expose internal IDs in URLs - use UUIDs or slugs

### File Upload & Media Rules

- **ALWAYS** validate file types, sizes, and content before upload
- **NEVER** allow direct file uploads to server filesystem
- **ALWAYS** use Supabase Storage or secure cloud storage
- **ALWAYS** scan uploaded files for malware
- **ALWAYS** implement file size limits (images: 5MB, documents: 10MB, videos: 100MB)
- **ALWAYS** generate unique filenames to prevent conflicts
- **ALWAYS** implement image optimization and compression

### API Design Rules

- **ALWAYS** follow RESTful conventions
- **ALWAYS** implement proper HTTP status codes
- **ALWAYS** use consistent error response format
- **ALWAYS** implement request/response logging
- **ALWAYS** validate all inputs with Zod schemas
- **ALWAYS** implement pagination for list endpoints
- **ALWAYS** use proper caching strategies
- **NEVER** expose sensitive data in API responses

### Code Structure Rules

- **ALWAYS** use feature-based folder structure
- **ALWAYS** implement custom hooks for reusable logic
- **ALWAYS** use proper TypeScript interfaces and types
- **ALWAYS** implement proper error handling with try-catch blocks
- **ALWAYS** use async/await instead of .then() chains
- **ALWAYS** implement loading states and skeleton screens
- **NEVER** use any or unknown types without proper type guards

### Performance Rules

- **ALWAYS** implement lazy loading for images and components
- **ALWAYS** use React.memo for expensive components
- **ALWAYS** implement proper caching with React Query/SWR
- **ALWAYS** optimize bundle size with dynamic imports
- **ALWAYS** implement proper SEO meta tags
- **ALWAYS** use Next.js Image component for all images
- **ALWAYS** implement Progressive Web App features

### UI/UX Rules - Mobile-First Design for School Students

- **ALWAYS** implement mobile-first responsive design as PRIMARY priority (students use phones most)
- **ALWAYS** design for touch interactions with minimum 44px touch targets
- **ALWAYS** use large, colorful, and engaging UI elements that appeal to students
- **ALWAYS** implement smooth animations and micro-interactions for engagement
- **ALWAYS** follow accessibility guidelines (WCAG 2.1 AA) with high contrast ratios
- **ALWAYS** implement proper focus management with visible focus indicators
- **ALWAYS** use semantic HTML elements for screen readers
- **ALWAYS** implement proper loading states with skeleton screens and spinners
- **ALWAYS** provide immediate visual feedback for all user actions
- **ALWAYS** implement proper form validation with clear, friendly error messages
- **ALWAYS** use intuitive navigation patterns optimized for thumb navigation
- **ALWAYS** implement swipe gestures and touch-friendly interactions
- **ALWAYS** ensure text is easily readable on small screens (minimum 16px)
- **ALWAYS** use progressive disclosure to avoid overwhelming students
- **ALWAYS** implement dark mode support for better accessibility
- **ALWAYS** test on actual mobile devices, not just browser emulation
- **ALWAYS** prioritize mobile performance with lazy loading and code splitting
- **ALWAYS** use mobile-friendly animations with reduced motion support
- **ALWAYS** implement PWA features for app-like experience
- **ALWAYS** ensure all interactive elements are thumb-friendly on mobile
- **ALWAYS** use vibrant, student-friendly color schemes that work in both light and dark modes

## Role-Specific Security Rules

### Student Portal Rules

- **ALWAYS** verify student can only access their own data
- **ALWAYS** implement secure assignment submission with virus scanning
- **ALWAYS** log all academic activities for audit
- **NEVER** allow students to modify attendance or grades

### Teacher Portal Rules

- **ALWAYS** verify teacher can only access assigned classes
- **ALWAYS** implement approval workflow for grade changes
- **ALWAYS** log all grade modifications with timestamps
- **ALWAYS** validate teacher permissions for each student action

### Parent Portal Rules

- **ALWAYS** verify parent can only access their child's data
- **ALWAYS** implement secure payment processing
- **ALWAYS** require additional authentication for fee payments
- **NEVER** cache sensitive financial information

### Admin Panel Rules

- **ALWAYS** implement multi-factor authentication for admins
- **ALWAYS** log all admin actions with detailed audit trails
- **ALWAYS** implement confirmation dialogs for destructive actions
- **ALWAYS** require supervisor approval for critical operations
- **ALWAYS** implement IP whitelisting for admin access

## Data Privacy & Compliance Rules

- **ALWAYS** implement data minimization principles
- **ALWAYS** provide data export functionality for users
- **ALWAYS** implement data retention policies
- **ALWAYS** anonymize data for analytics
- **NEVER** share personal data without explicit consent
- **ALWAYS** implement GDPR compliance features

## Testing Rules

- **ALWAYS** write unit tests for utility functions
- **ALWAYS** write integration tests for API endpoints
- **ALWAYS** implement E2E tests for critical user flows
- **ALWAYS** test with different user roles and permissions
- **ALWAYS** test form validation edge cases
- **NEVER** commit code without proper test coverage

## Error Handling Rules

- **ALWAYS** implement global error handling
- **ALWAYS** provide user-friendly error messages
- **ALWAYS** log errors with proper context and stack traces
- **ALWAYS** implement fallback UI for component errors
- **NEVER** expose technical error details to end users

## Monitoring & Logging Rules

- **ALWAYS** implement application performance monitoring
- **ALWAYS** log security-related events
- **ALWAYS** monitor for unusual user behavior
- **ALWAYS** implement uptime monitoring
- **ALWAYS** track user engagement metrics

## Code Quality Rules

- **ALWAYS** use ESLint with strict rules
- **ALWAYS** use Prettier for code formatting
- **ALWAYS** implement pre-commit hooks
- **ALWAYS** write meaningful commit messages
- **ALWAYS** conduct code reviews for all changes
- **ALWAYS** document complex business logic

## Deployment Rules

- **ALWAYS** use environment-specific configurations
- **ALWAYS** implement CI/CD pipelines
- **ALWAYS** run security scans before deployment
- **ALWAYS** implement database migration scripts
- **ALWAYS** test in staging environment before production
- **NEVER** deploy directly to production without testing

## Specific Feature Rules

### MCQ Test System

- **ALWAYS** implement time-based question expiry
- **ALWAYS** prevent answer submission after time limit
- **ALWAYS** randomize question order
- **ALWAYS** implement anti-cheating measures

### Payment System

- **ALWAYS** use PCI DSS compliant payment processors
- **ALWAYS** implement transaction encryption
- **ALWAYS** provide payment receipts and audit trails
- **NEVER** store credit card information

### Chat System

- **ALWAYS** implement message encryption
- **ALWAYS** moderate chat content for inappropriate language
- **ALWAYS** implement user blocking/reporting features
- **ALWAYS** log all communications for compliance

### File Sharing

- **ALWAYS** implement access controls for shared files
- **ALWAYS** scan files for viruses before sharing
- **ALWAYS** implement file versioning
- **ALWAYS** provide download audit trails

## Emergency Response Rules

- **ALWAYS** implement circuit breakers for external APIs
- **ALWAYS** have fallback mechanisms for critical features
- **ALWAYS** implement graceful degradation
- **ALWAYS** maintain emergency contact procedures
- **ALWAYS** implement data backup and recovery procedures

## Documentation Rules

- **ALWAYS** document API endpoints with OpenAPI/Swagger
- **ALWAYS** maintain up-to-date README files
- **ALWAYS** document deployment procedures
- **ALWAYS** maintain security incident response procedures

## GitHub Copilot Custom Rules for Backend Development

### Core Development Rules

#### TypeScript & Code Quality

- **ALWAYS** use TypeScript with strict mode enabled - NO JavaScript files
- **ALWAYS** define proper interfaces and types for all data structures
- **NEVER** use `any` or `unknown` types without proper type guards
- **ALWAYS** use meaningful variable and function names
- **ALWAYS** implement proper error handling with try-catch blocks
- **ALWAYS** use async/await instead of .then() chains
- **ALWAYS** validate all inputs with Zod schemas before processing
- **ALWAYS** sanitize outputs to prevent XSS attacks

#### Database & Prisma Rules

- **ALWAYS** use UUID as primary keys, never expose auto-increment integers
- **ALWAYS** implement soft delete with `deletedAt` timestamps for sensitive data
- **ALWAYS** use prepared statements (Prisma handles this automatically)
- **NEVER** use string concatenation for dynamic queries
- **ALWAYS** implement proper database transactions for multi-table operations
- **ALWAYS** add audit trails for all sensitive operations
- **ALWAYS** use proper foreign key constraints with cascading rules
- **ALWAYS** add timestamps (`createdAt`, `updatedAt`) to all models
- **ALWAYS** implement proper indexing for frequently queried fields

#### Authentication & Security Rules

- **ALWAYS** hash passwords with bcrypt using minimum 12 rounds
- **ALWAYS** implement role-based access control (RBAC) on every endpoint
- **ALWAYS** validate user permissions on both client and server side
- **ALWAYS** implement rate limiting on all API routes
- **ALWAYS** use environment variables for all secrets and configuration
- **NEVER** store sensitive data in localStorage or expose secrets in client code
- **ALWAYS** implement CSRF protection for forms
- **ALWAYS** sanitize all user inputs before database operations
- **ALWAYS** implement session timeout and auto-logout
- **ALWAYS** log all security-related events for audit purposes

#### API Design Rules

- **ALWAYS** follow RESTful conventions for API endpoints
- **ALWAYS** implement consistent error response format
- **ALWAYS** use proper HTTP status codes (400, 401, 403, 404, 500)
- **ALWAYS** implement request/response logging with correlation IDs
- **ALWAYS** validate all inputs with Zod schemas
- **ALWAYS** implement pagination for list endpoints (cursor or offset-based)
- **ALWAYS** use proper caching strategies with appropriate headers
- **NEVER** expose internal implementation details in API responses
- **ALWAYS** implement API versioning (e.g., /api/v1/)

#### File Upload & Storage Rules

- **ALWAYS** validate file types, sizes, and content before upload
- **NEVER** allow direct file uploads to server filesystem
- **ALWAYS** scan uploaded files for malware using ClamAV
- **ALWAYS** implement file size limits (images: 5MB, documents: 10MB, videos: 100MB)
- **ALWAYS** generate unique filenames to prevent conflicts
- **ALWAYS** implement image optimization and compression
- **ALWAYS** use secure storage solutions (MinIO/S3/Supabase Storage)
- **ALWAYS** implement access controls for file downloads

#### Error Handling & Logging Rules

- **ALWAYS** implement global error handling middleware
- **ALWAYS** provide user-friendly error messages (never expose technical details)
- **ALWAYS** log errors with proper context, stack traces, and correlation IDs
- **ALWAYS** implement proper error boundaries for async operations
- **ALWAYS** use structured logging with Pino for better searchability
- **ALWAYS** implement different log levels (debug, info, warn, error)

#### Performance & Optimization Rules

- **ALWAYS** implement proper caching strategies (Redis for sessions, app-level for static data)
- **ALWAYS** optimize database queries to prevent N+1 problems
- **ALWAYS** implement connection pooling for database connections
- **ALWAYS** use CDN for static assets and media files
- **ALWAYS** implement lazy loading for heavy operations
- **ALWAYS** monitor and optimize bundle sizes
- **ALWAYS** implement proper pagination and limit result sets

#### Testing Rules

- **ALWAYS** write unit tests for utility functions and business logic
- **ALWAYS** write integration tests for API endpoints
- **ALWAYS** implement E2E tests for critical user flows
- **ALWAYS** test with different user roles and permissions
- **ALWAYS** test form validation edge cases and error scenarios
- **ALWAYS** achieve minimum 80% test coverage
- **NEVER** commit code without proper test coverage

### Role-Specific Backend Rules

#### Student Management Rules

- **ALWAYS** verify student can only access their own data
- **ALWAYS** implement parent-child relationship validation
- **ALWAYS** log all academic activities for audit trails
- **NEVER** allow students to modify attendance or grades directly
- **ALWAYS** implement anti-cheating measures for MCQ tests
- **ALWAYS** validate assignment submission deadlines and file types

#### Teacher Management Rules

- **ALWAYS** verify teacher can only access assigned classes and students
- **ALWAYS** implement approval workflow for grade changes
- **ALWAYS** log all grade modifications with timestamps and reasons
- **ALWAYS** validate teacher permissions for each student action
- **ALWAYS** implement bulk operations with proper validation

#### Parent Management Rules

- **ALWAYS** verify parent can only access their child's data
- **ALWAYS** implement secure payment processing with PCI compliance
- **ALWAYS** require additional authentication for fee payments
- **NEVER** cache sensitive financial information
- **ALWAYS** provide transaction receipts and audit trails

#### Admin Management Rules

- **ALWAYS** implement multi-factor authentication for admins
- **ALWAYS** log all admin actions with detailed audit trails
- **ALWAYS** implement confirmation dialogs for destructive actions
- **ALWAYS** require supervisor approval for critical operations
- **ALWAYS** implement IP whitelisting for admin access when possible

### Data Privacy & Compliance Rules

- **ALWAYS** implement data minimization principles
- **ALWAYS** provide data export functionality for users (GDPR compliance)
- **ALWAYS** implement data retention policies with automatic cleanup
- **ALWAYS** anonymize data for analytics and reporting
- **NEVER** share personal data without explicit consent
- **ALWAYS** implement GDPR compliance features (right to be forgotten)
- **ALWAYS** encrypt sensitive data at rest and in transit

### MCQ Test System Rules

- **ALWAYS** implement time-based question expiry
- **ALWAYS** prevent answer submission after time limit expires
- **ALWAYS** randomize question order for each student
- **ALWAYS** implement tab switching detection and logging
- **ALWAYS** prevent copy-paste and screenshot detection
- **ALWAYS** track unusual timing patterns for cheating detection
- **ALWAYS** implement IP address monitoring during tests
- **NEVER** allow multiple simultaneous attempts

### Fee Management Rules

- **ALWAYS** use PCI DSS compliant payment processors for online payments
- **ALWAYS** implement transaction encryption and secure tokenization
- **ALWAYS** provide detailed payment receipts and audit trails
- **NEVER** store credit card information in application database
- **ALWAYS** implement proper reconciliation processes
- **ALWAYS** validate payment amounts and currency formatting

### File & Media Management Rules

- **ALWAYS** implement access controls for shared files and media
- **ALWAYS** scan files for viruses before processing or sharing
- **ALWAYS** implement file versioning for important documents
- **ALWAYS** provide download audit trails and access logs
- **ALWAYS** optimize images and videos for web delivery
- **ALWAYS** implement proper backup strategies for media assets

### Communication & Chat Rules

- **ALWAYS** implement message encryption for sensitive communications
- **ALWAYS** moderate chat content for inappropriate language
- **ALWAYS** implement user blocking and reporting features
- **ALWAYS** log all communications for compliance and safety
- **ALWAYS** implement message retention policies
- **ALWAYS** provide parental controls for student communications

### Environment & Configuration Rules

- **ALWAYS** use different configurations for development, staging, and production
- **ALWAYS** implement proper environment variable validation
- **NEVER** commit secrets or API keys to version control
- **ALWAYS** use secure methods for secret management
- **ALWAYS** implement proper backup and disaster recovery procedures
- **ALWAYS** document all environment setup and deployment procedures

### Migration & Supabase Preparation Rules

- **ALWAYS** write database-agnostic code using Prisma abstractions
- **ALWAYS** implement proper abstraction layers for auth and storage
- **ALWAYS** create migration scripts with rollback capabilities
- **ALWAYS** test compatibility between MySQL and PostgreSQL data types
- **ALWAYS** implement proper data validation during migration
- **ALWAYS** maintain backward compatibility during transition periods

### Monitoring & Alerting Rules

- **ALWAYS** implement application performance monitoring (APM)
- **ALWAYS** set up proper alerting for system failures and security events
- **ALWAYS** monitor database performance and query optimization
- **ALWAYS** track user engagement and system usage metrics
- **ALWAYS** implement uptime monitoring with proper SLA targets
- **ALWAYS** monitor for unusual user behavior patterns

### Code Organization Rules

- **ALWAYS** use feature-based folder structure for better organization
- **ALWAYS** implement proper separation of concerns (controllers, services, repositories)
- **ALWAYS** create reusable utility functions and custom hooks
- **ALWAYS** implement proper dependency injection patterns
- **ALWAYS** maintain consistent coding standards across the entire codebase
- **ALWAYS** document complex business logic and algorithms

### Emergency Response Rules

- **ALWAYS** implement circuit breakers for external API calls
- **ALWAYS** have fallback mechanisms for critical features
- **ALWAYS** implement graceful degradation when services are unavailable
- **ALWAYS** maintain emergency contact procedures and incident response plans
- **ALWAYS** implement automated backup verification and testing

Remember: This is an educational institution handling sensitive data of minors. Security, privacy, and reliability are paramount. When in doubt, choose the more secure and robust approach. Every line of code should be written with the assumption that it will be audited for security and compliance.
