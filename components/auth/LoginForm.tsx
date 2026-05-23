'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/lib/types';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Demo authentication - check for demo credentials
      const demoCredentials = [
        {
          email: 'admin@dvld.com',
          password: 'password123',
          role: 'admin',
          name: 'System Admin',
        },
        {
          email: 'school@dvld.com',
          password: 'password123',
          role: 'school_admin',
          name: 'School Admin',
          schoolId: 'S001',
        },
        {
          email: 'instructor@dvld.com',
          password: 'password123',
          role: 'instructor',
          name: 'Instructor',
          schoolId: 'S001',
        },
      ];

      const validUser = demoCredentials.find(
        (cred) => cred.email === email && cred.password === password
      );

      if (!validUser) {
        setError('Invalid email or password. Try admin@dvld.com / password123');
        setLoading(false);
        return;
      }

      // Create demo token and user data
      const token = `demo-token-${Date.now()}`;
      const user = {
        id: `user-${validUser.email}`,
        email: validUser.email,
        name: validUser.name,
        role: validUser.role,
        schoolId: validUser.schoolId || 'S001',
        createdAt: new Date().toISOString(),
      };

      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/school/dashboard');
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass glass-lg rounded-lg border border-slate-700/50 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
              <span className="text-2xl font-bold text-white">📚</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">DVLD Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Driving License & School Hub
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="glass border-slate-700/50 bg-slate-900/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="glass border-slate-700/50 bg-slate-900/40 pr-10 text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-rose-500/20 p-3 text-sm text-rose-400 border border-rose-500/30">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 space-y-3 text-center text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Demo Accounts:</p>
          <div className="space-y-2 rounded-lg bg-slate-800/50 p-3">
            <div>
              <p className="text-cyan-400 font-mono">admin@dvld.com</p>
              <p className="text-xs text-muted-foreground">System Admin Dashboard</p>
            </div>
            <div className="border-t border-slate-700/50 pt-2">
              <p className="text-cyan-400 font-mono">school@dvld.com</p>
              <p className="text-xs text-muted-foreground">School Admin Dashboard</p>
            </div>
            <div className="border-t border-slate-700/50 pt-2">
              <p className="text-cyan-400 font-mono">instructor@dvld.com</p>
              <p className="text-xs text-muted-foreground">Instructor Dashboard</p>
            </div>
            <p className="border-t border-slate-700/50 pt-2 font-mono text-muted-foreground">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
