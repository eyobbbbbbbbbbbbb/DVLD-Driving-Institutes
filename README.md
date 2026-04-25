# DVLD Web Portal

A modern driving school management dashboard built with **Next.js 16**, **Tailwind CSS 4**, and a glassmorphic dark theme. The portal is designed to support both school administrators and system administrators with fast, polished interfaces for operations, finance, communication, and analytics.

## 🚀 What is DVLD Portal

DVLD Portal is a demonstration web application for driving schools and training centers. It provides a polished admin experience for:
- Student and course management
- Attendance tracking
- Batch and vehicle coordination
- School-level announcements and notifications
- Revenue and payments monitoring
- System-wide analytics for multi-school operations

## ✨ Key Features

- **Role-based dashboards** for School Admin and System Admin
- **Secure login flow** with protected routes
- **Glassmorphic dark UI** with blurred panels, gradient accents, and smooth animations
- **Responsive design** for desktop and mobile
- **Reusable component library** built with shadcn/ui and custom Tailwind utilities
- **Charts and KPI cards** for data-driven dashboards
- **API-ready architecture** with Axios interceptors and typed TypeScript models

## 🧭 Project Structure

- `/app` – Next.js App Router pages and layouts
- `/components` – Reusable UI components and layout primitives
- `/lib` – API utilities, types, and shared helpers
- `/public` – Static assets
- `/styles` – Global styling and theme configuration

## 📁 Important Routes

### School Administrator
- `/school/dashboard` – Overview KPIs, trends, and analytics
- `/school/students` – Student list and search filtering
- `/school/batches` – Batch management and enrollment tracking
- `/school/attendance` – Attendance status and daily records
- `/school/courses` – Course catalog and details
- `/school/vehicles` – Vehicle inventory and status
- `/school/announcements` – Announcement management
- `/school/notifications` – School notifications inbox
- `/school/payments` – Payment and revenue tracking
- `/school/settings` – School settings and profile configuration

### System Administrator
- `/admin/dashboard` – Global KPIs and school performance summaries
- `/admin/revenue` – Revenue analytics and export-ready reporting

## 🧰 Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui**
- **Recharts**
- **Axios**
- **lucide-react**

## 🔧 Architecture Highlights

- Centralized layout components in `/components/layout`
- Shared UI primitives in `/components/ui`
- Typed API models under `/lib/types.ts`
- Token-aware Axios client for authentication support
- Mock-data scaffolding for rapid UI development

## ⚙️ Getting Started

```bash
pnpm install
pnpm dev
```

Build for production:

```bash
pnpm build
```

## 🌐 Environment

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## 🔐 Demo Credentials

Use the sample login credentials for local testing:

```text
Email: admin@dvld.com
Password: password123
```

## 🧩 Customization

### Theme
Customize the global theme colors in `/app/globals.css` using CSS variables.

### Add a new page
1. Create a new `page.tsx` in the appropriate folder under `/app`
2. Add navigation links in the relevant layout file
3. Register any new UI components in `/components`

## 📌 Notes

- Current implementation uses mock/sample data for UI demonstration.
- The dashboard and admin pages are ready for backend integration.
- Forms and charts are built to support future validation and real data.

## 🚧 Future Improvements

- Add real backend API integration for data persistence
- Implement full form validation with React Hook Form + Zod
- Add role management and permissions
- Expand analytics and export workflows
- Add user profile and settings pages

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)

---

**DVLD Portal** — Driving school admin experience designed for modern training operations.
