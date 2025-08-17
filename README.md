# Happy Child School (HCS) Management System

A modern, comprehensive school management system built with Next.js, TypeScript, and Supabase.

## 🏗️ Architecture

This project uses a **serverless architecture** with:

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel (Frontend)
- **Storage**: Supabase Storage

## 🚀 Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: React Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend & Database

- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API**: Supabase REST API & Real-time API

## 📁 Project Structure

```
hcs-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Role-based dashboards
│   │   ├── login/             # Authentication
│   │   └── ...                # Other pages
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── admin/            # Admin-specific components
│   │   ├── teacher/          # Teacher-specific components
│   │   ├── student/          # Student-specific components
│   │   └── parent/           # Parent-specific components
│   ├── lib/                  # Utility functions
│   │   ├── supabase.ts       # Supabase client configuration
│   │   ├── utils.ts          # General utilities
│   │   └── validations.ts    # Zod schemas
│   ├── types/                # TypeScript type definitions
│   └── context/              # React context providers
├── public/                   # Static assets
└── ...config files
```

## 🔑 Key Features

### Multi-Role Dashboard System

- **Admin**: Complete system management
- **Teacher**: Class management, assignments, grades
- **Student**: View assignments, grades, attendance
- **Parent**: Monitor child's progress
- **Coordinator**: Academic oversight
- **Librarian**: Library management
- **Media Coordinator**: Digital content management

### Core Modules

- 👥 **User Management**: Role-based access control
- 🎓 **Academic Management**: Classes, subjects, curriculum
- 📚 **Assignment System**: Create, submit, grade assignments
- 📊 **Grade Management**: Comprehensive grading system
- 📅 **Attendance Tracking**: Real-time attendance management
- 💰 **Fee Management**: Fee collection and tracking
- 📖 **Library System**: Book management and circulation
- 🎭 **Co-curricular Activities**: Event and activity management
- 💬 **Communication**: Real-time messaging system
- 📱 **Mobile-First Design**: Optimized for student device usage

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd HCS/hcs-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Application
   NEXT_PUBLIC_APP_NAME="Happy Child School"
   NEXT_PUBLIC_APP_VERSION="1.0.0"
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses Supabase with a comprehensive schema including:

- **Users & Profiles**: User authentication and profile management
- **Academic Structure**: Schools, classes, subjects, academic years
- **Student Management**: Student records, enrollment, academic progress
- **Teacher Management**: Teacher profiles, assignments, performance
- **Parent Management**: Parent profiles and student relationships
- **Assessment System**: Assignments, submissions, grades
- **Attendance System**: Daily attendance tracking
- **Fee Management**: Fee structures, payments, receipts
- **Library System**: Books, borrowing, fines
- **Communication**: Messages, notifications, announcements

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Role-based Access Control**: Granular permission system
- **Data Encryption**: Sensitive data encryption
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API abuse prevention
- **Secure File Upload**: Validated file handling

## 📱 Mobile-First Design

Optimized for student usage with:

- Touch-friendly interfaces (44px minimum touch targets)
- Progressive Web App (PWA) features
- Offline capability for key features
- Fast loading with code splitting
- Responsive design across all devices
- Dark mode support
- Accessibility compliance (WCAG 2.1 AA)

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📊 Performance

- **Core Web Vitals**: Optimized for excellent scores
- **Bundle Size**: Minimized with dynamic imports
- **Caching**: Intelligent caching strategies
- **Image Optimization**: Next.js Image component
- **Database**: Optimized queries and indexing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the FAQ section

---

**Happy Child School Management System** - Empowering education through technology 🎓
