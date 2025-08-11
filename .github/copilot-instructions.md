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

### UI/UX Rules

- **ALWAYS** implement responsive design (mobile-first)
- **ALWAYS** follow accessibility guidelines (WCAG 2.1 AA)
- **ALWAYS** implement proper focus management
- **ALWAYS** use semantic HTML elements
- **ALWAYS** implement proper loading and error states
- **ALWAYS** provide user feedback for all actions
- **ALWAYS** implement proper form validation with clear error messages

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

Remember: This is an educational institution handling sensitive data of minors. Security, privacy,
and reliability are paramount. When in doubt, choose the more secure and robust approach.
