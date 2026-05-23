// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'school_admin' | 'instructor' | 'student';
  schoolId?: string;
  createdAt: string;
}

// Student Types
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'suspended';
  progress: number; // 0-100
  batchId: string;
  currentLevel: number;
}

export interface StudentDetail extends Student {
  courseHistory: Course[];
  attendanceRate: number;
  certificateStatus: string;
}

// Batch Types
export interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  instructorId: string;
  capacity: number;
  enrolledCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Attendance Types
export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  duration: number; // in minutes
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

// Course Types
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: number; // in hours
  level: number;
  instructor: string;
  status: 'active' | 'inactive';
}

// Vehicle Types
export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastMaintenanceDate: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Payment Types
export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  paymentMethod: string;
}

export interface PaymentSummary {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  monthlyTrend: { month: string; amount: number }[];
}

// School Settings Types
export interface SchoolSettings {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  operatingHours: string;
  maxStudentsPerBatch: number;
}

// Dashboard Types
export interface SchoolDashboardMetrics {
  totalStudents: number;
  activeBatches: number;
  instructors: number;
  vehicles: number;
  totalRevenue: number;
  attendanceRate: number;
  certificatesIssued: number;
  passRate: number;
  enrollmentTrend: { month: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
  passRateByMonth: { month: string; rate: number }[];
}

export interface AdminDashboardMetrics {
  totalSchools: number;
  totalStudents: number;
  totalRevenue: number;
  totalCertificates: number;
  schoolsActiveStatus: { name: string; count: number }[];
  revenueBySchool: { school: string; revenue: number }[];
  enrollmentGrowth: { month: string; count: number }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}
