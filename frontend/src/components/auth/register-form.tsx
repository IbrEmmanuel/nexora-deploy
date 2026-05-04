'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Please enter a valid email address'),
    organizationName: z.string().min(2, 'Organization name must be at least 2 characters').max(100),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const benefits = [
  'Deploy AI agents in minutes',
  'Monitor energy & IoT in real time',
  'Bloomberg-grade analytics',
  'SOC 2 compliant security',
  '14-day free trial, no credit card',
];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          organizationName: data.organizationName,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message ?? 'Registration failed. Please try again.');
        return;
      }

      toast.success('Account created! Please check your email to verify your account.');
      router.push('/login?registered=true');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 flex-col items-center justify-center p-12">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" aria-hidden="true" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[80px]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" aria-hidden="true" />

        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="12" y="2" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="2" y="12" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">NexoraGrid</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
            Start your<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              free trial today
            </span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Join 500+ enterprises already running on the world's most advanced business OS.
          </p>

          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-white/60">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: glass form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-zinc-950 lg:bg-zinc-900/50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="12" y="2" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="2" y="12" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-white">NexoraGrid</span>
          </div>

          <div className="glass-md rounded-2xl p-8 border border-white/[0.08]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white/90">Create your account</h1>
              <p className="text-sm text-white/40 mt-1">Get started with a 14-day free trial</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="text-sm font-medium text-white/60">First name</label>
                  <input
                    id="firstName"
                    placeholder="Jane"
                    autoComplete="given-name"
                    {...register('firstName')}
                    className={cn(
                      "w-full h-10 px-3 rounded-xl border bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 outline-none transition-all",
                      "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40",
                      errors.firstName ? "border-red-500/50" : "border-white/[0.08]",
                    )}
                  />
                  {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="text-sm font-medium text-white/60">Last name</label>
                  <input
                    id="lastName"
                    placeholder="Smith"
                    autoComplete="family-name"
                    {...register('lastName')}
                    className={cn(
                      "w-full h-10 px-3 rounded-xl border bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 outline-none transition-all",
                      "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40",
                      errors.lastName ? "border-red-500/50" : "border-white/[0.08]",
                    )}
                  />
                  {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-white/60">Work email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register('email')}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 outline-none transition-all",
                    "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40",
                    errors.email ? "border-red-500/50" : "border-white/[0.08]",
                  )}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="organizationName" className="text-sm font-medium text-white/60">Organization name</label>
                <input
                  id="organizationName"
                  placeholder="Acme Corp"
                  autoComplete="organization"
                  {...register('organizationName')}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 outline-none transition-all",
                    "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40",
                    errors.organizationName ? "border-red-500/50" : "border-white/[0.08]",
                  )}
                />
                {errors.organizationName && <p className="text-xs text-red-400">{errors.organizationName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-white/60">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    {...register('password')}
                    className={cn(
                      "w-full h-10 px-3 pr-10 rounded-xl border bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 outline-none transition-all",
                      "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40",
                      errors.password ? "border-red-500/50" : "border-white/[0.08]",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white/60">Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 outline-none transition-all",
                    "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40",
                    errors.confirmPassword ? "border-red-500/50" : "border-white/[0.08]",
                  )}
                />
                {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              <p className="text-xs text-white/25">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <>Create account <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/30 mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Sign in
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
