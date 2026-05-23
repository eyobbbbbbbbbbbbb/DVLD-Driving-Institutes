# DVLD Web Portal - Driving License & School Hub

A comprehensive, modern driving school management system built with Next.js 16, featuring a premium glassmorphic dark theme, real-time dashboards, and multi-user role support.

## 🎯 Project Overview

The DVLD Portal is a full-featured web application designed for driving schools to manage:
- **Student Management**: Track enrollments, progress, and certifications
- **Training Operations**: Manage batches, instructors, vehicles, and attendance
- **Financial Operations**: Revenue tracking, payments, and reporting
- **Communications**: Announcements, notifications, and school-wide messaging
- **Admin Dashboard**: System-wide analytics and multi-school insights

## 🎨 Design Features

### Glassmorphic Dark Theme
- **Color Palette**: Deep slate backgrounds (#0b0f19) with cyan-blue-emerald-amber accents
- **Visual Effects**: Backdrop blur, semi-transparent overlays, smooth gradients
- **Micro-animations**: Hover scale effects, smooth transitions, pulsing loaders
- **Typography**: Clean sans-serif fonts with semantic sizing

### Responsive Layout
- Mobile-first design with Tailwind CSS
- Flexible sidebar navigation that adapts to screen sizes
- Full-page screenshots support desktop, tablet, and mobile viewports

## 📱 Application Structure

### Authentication Flow
- **Login Page**: `/auth/login` - Email/password authentication with demo credentials
- **Protected Routes**: All dashboards require valid token in localStorage
- **Role-Based Access**: Automatic routing to School Admin or System Admin dashboards

### School Administrator Routes
Located in `/school` directory:
- **Dashboard** (`/school/dashboard`) - KPI overview, enrollment trends, revenue analytics
- **Students** (`/school/students`) - Student list with progress tracking, filtering, search
- **Training Batches** (`/school/batches`) - Batch management with enrollment caps
- **Attendance** (`/school/attendance`) - Daily attendance marking with quick status toggles
- **Courses** (`/school/courses`) - Course catalog with level and duration management
- **Vehicles** (`/school/vehicles`) - Vehicle inventory with maintenance tracking
- **Announcements** (`/school/announcements`) - Create and manage school announcements
- **Notifications** (`/school/notifications`) - Message inbox with filtering
- **Payments** (`/school/payments`) - Revenue tracking and payment status
- **Settings** (`/school/settings`) - School profile and configuration management

### System Administrator Routes
Located in `/admin` directory:
- **Dashboard** (`/admin/dashboard`) - Global KPIs, school performance, pie charts
- **Revenue Report** (`/admin/revenue`) - Detailed multi-school revenue analysis with export

## 🔧 Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 with custom utilities
- **UI Components**: shadcn/ui (pre-installed)
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios with interceptors

### Key Libraries
- **lucide-react**: Icon components
- **React Hook Form**: Form handling (ready for implementation)
- **Zod**: Schema validation (ready for implementation)

### API Integration
- **Base URL**: `http://localhost:5000/api` (configurable)
- **Authentication**: Bearer token in Authorization header
- **Interceptors**: Automatic token injection, 401 redirect handling

## 📊 Data Types

All TypeScript interfaces defined in `/lib/types.ts`:
- User, LoginRequest, LoginResponse
- Student, StudentDetail, Batch, Course, Vehicle
- Attendance, AttendanceRecord
- Announcement, Notification
- Payment, PaymentSummary
- SchoolSettings, SchoolDashboardMetrics, AdminDashboardMetrics

## 🎯 Component Architecture

### Shared Components
Located in `/components/shared`:
- **KPICard**: Statistic cards with icons, trends, and gradient backgrounds
- **StatusBadge**: Color-coded status indicators (active, pending, completed, etc.)
- **LoadingSkeleton**: Shimmer animation loaders for tables, cards, and charts

### Layout Components
Located in `/components/layout`:
- **SidebarNav**: Reusable navigation sidebar with active states
- **LoginForm**: Authentication form with password visibility toggle

### Chart Components
Located in `/components/charts`:
- Integration-ready chart components using Recharts

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Demo Credentials
```
Email: admin@dvld.com
Password: password123
```

### Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## 🎨 Customization

### Theme Colors
Edit CSS custom properties in `/app/globals.css`:
```css
:root {
  --background: #0b0f19;
  --primary: #06b6d4;
  --secondary: #2563eb;
  --accent: #10b981;
  /* ... more colors */
}
```

### Adding New Pages
1. Create file in `/app/school/[page]/page.tsx`
2. Add navigation item to `/app/school/layout.tsx`
3. Import required components and use consistent styling

## 📈 Features Implemented

✅ **Phase 1 - Foundation**
- Dark glassmorphic theme with custom utilities
- Authentication system with login flow
- Layout components (sidebar, navigation)
- KPI card component with trending indicators
- Status badge component for status indicators

✅ **Phase 2 - Core Pages**
- School Dashboard with 6 KPI cards and 3 chart visualizations
- Student Management with data table, search, filtering
- Training Batches with enrollment progress tracking
- Attendance tracking with present/late/absent toggles
- Real-time statistics and update capability

✅ **Phase 3 - Supporting Pages**
- Courses management with course details
- Vehicles inventory with maintenance scheduling
- Announcements with create/edit functionality
- Notifications inbox with filtering and actions
- Payments tracking with revenue summary
- Settings page with school profile management

✅ **Phase 4 - Admin Features**
- Admin Dashboard with global KPIs and visualizations
- Revenue Report with multi-school analytics and export

## 🔌 API Integration Pattern

```typescript
// Example API call
const response = await apiClient.post<LoginResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

The API client automatically:
- Adds Bearer token from localStorage
- Handles 401 errors with redirect to login
- Provides typed responses
- Manages error states

## 📝 Notes

- All pages use mock data for demonstration
- Ready to integrate with real backend API
- Charts use sample trend data (easily replaceable)
- Forms are scaffolded for validation integration
- Loading states implemented with skeleton loaders

## 🎓 Learning Resources

- [Next.js 16 App Router](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)

---

**Built with v0** - A modern driving school management platform.
