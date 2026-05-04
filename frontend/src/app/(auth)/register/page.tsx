import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your NexoraGrid account and start your free trial.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
