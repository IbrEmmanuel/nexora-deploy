'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Github, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch {
      toast.error('OAuth sign in failed. Please try again.');
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 flex-col items-center justify-center p-12">
        {/* Mesh orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px]" aria-hidden="true" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" aria-hidden="true" />

        <div className="relative z-10 text-center max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-pulse-glow">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="12" y="2" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="2" y="12" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">NexoraGrid</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            The OS for<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Modern Business
            </span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            AI agents, energy monitoring, and enterprise intelligence — unified in one platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['AI Agents', 'Energy IoT', 'Analytics', 'Integrations'].map((f) => (
              <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: glass form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-zinc-950 lg:bg-zinc-900/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
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
              <h1 className="text-2xl font-bold text-white/90">Welcome back</h1>
              <p className="text-sm text-white/40 mt-1">Sign in to your command center</p>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={!!oauthLoading || isLoading}
                className="flex items-center justify-center gap-2 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/70 hover:bg-white/[0.08] hover:text-white/90 transition-all disabled:opacity-50"
              >
                {oauthLoading === 'google' ? (
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('github')}
                disabled={!!oauthLoading || isLoading}
                className="flex items-center justify-center gap-2 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/70 hover:bg-white/[0.08] hover:text-white/90 transition-all disabled:opacity-50"
              >
                {oauthLoading === 'github' ? (
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <Github className="h-4 w-4" aria-hidden="true" />
                )}
                GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/25">Or continue with email</span>
              </div>
            </div>

            {/* Credentials form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-white/60">Email</label>
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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-white/60">Password</label>
                  <a href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
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

              <button
                type="submit"
                disabled={isLoading || !!oauthLoading}
                className="w-full flex items-center justify-center gap-2 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <>Sign in <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/30 mt-6">
              Don't have an account?{' '}
              <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Sign up free
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
