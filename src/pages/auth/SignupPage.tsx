import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User as UserIcon, Lock } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Dropdown } from '../../components/ui/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, DEPARTMENTS, YEARS, APP_NAME } from '../../utils/constants';
import { passwordStrength } from '../../utils/cn';
import type { Role } from '../../types';

const step1Schema = z.object({
  name:       z.string().min(2, 'Enter your full name'),
  email:      z.string().min(1, 'Email is required').email('Enter a valid email'),
  department: z.string().min(1, 'Select a department'),
  year:       z.string().min(1, 'Select your year'),
});
const step2Schema = z
  .object({
    password:        z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Add an uppercase letter').regex(/[0-9]/, 'Add a number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    terms:           z.boolean().refine((v) => v, 'You must accept the terms'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;

const steps = [
  { id: 1, label: 'About you', icon: UserIcon },
  { id: 2, label: 'Security',  icon: Lock     },
  { id: 3, label: 'Done',      icon: Check    },
];

export default function SignupPage({ role }: { role: Role }) {
  const r = ROLES[role];
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<Step1>>({});

  const s1 = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: '', email: '', department: '', year: '' },
  });
  const s2 = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: { password: '', confirmPassword: '', terms: false },
  });

  const pw = s2.watch('password') ?? '';
  const strength = passwordStrength(pw);

  const onStep1 = (values: Step1) => {
    setData(values);
    setStep(2);
  };

  const onStep2 = async (values: Step2) => {
    setLoading(true);
    try {
      await registerUser({
        name:       data.name!,
        email:      data.email!,
        department: data.department!,
        year:       data.year!,
        password:   values.password,
        role,
      });
      setStep(3);
      toast({ title: 'Account created!', description: `Welcome to ${APP_NAME}!`, variant: 'success' });
      setTimeout(() => navigate(r.dashboardPath), 1600);
    } catch (err) {
      toast({ title: 'Registration failed', description: (err as Error).message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role={role}
      title={`Create ${r.title} account`}
      subtitle={`Join ${APP_NAME} in under a minute.`}
    >
      {/* Progress */}
      <div className="mb-7 flex items-center gap-2">
        {steps.map((s, i) => {
          const done   = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale:           active ? 1.08 : 1,
                    backgroundColor: done || active ? '#19376D' : '#E7E0D7',
                    color:           done || active ? '#fff'     : '#6B7280',
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : s.id}
                </motion.div>
                <span className={`hidden text-xs font-medium sm:block ${active ? 'text-navy' : 'text-ink-soft'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border-soft">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-navy"
                    animate={{ width: step > s.id ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="s1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            onSubmit={s1.handleSubmit(onStep1)}
            className="space-y-4"
          >
            <Input label="Full name"  placeholder="Your full name" error={s1.formState.errors.name?.message} {...s1.register('name')} />
            <Input label="Email" type="email" placeholder="you@campusos.app" leftIcon="Mail" error={s1.formState.errors.email?.message} {...s1.register('email')} />
            <div>
              <label className="mb-1.5 block text-[0.825rem] font-semibold text-ink">Department</label>
              <Dropdown
                value={s1.watch('department') ?? ''}
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                onChange={(v) => s1.setValue('department', v, { shouldValidate: true })}
                placeholder="Select department"
              />
              {s1.formState.errors.department && (
                <p className="mt-1.5 text-xs font-medium text-danger">{s1.formState.errors.department.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-[0.825rem] font-semibold text-ink">Year</label>
              <Dropdown
                value={s1.watch('year') ?? ''}
                options={YEARS.map((y) => ({ value: y, label: y }))}
                onChange={(v) => s1.setValue('year', v, { shouldValidate: true })}
                placeholder="Select year"
              />
              {s1.formState.errors.year && (
                <p className="mt-1.5 text-xs font-medium text-danger">{s1.formState.errors.year.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg" rightIcon="ArrowRight" magnetic>
              Continue
            </Button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="s2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            onSubmit={s2.handleSubmit(onStep2)}
            className="space-y-4"
          >
            <PasswordInput
              label="Password"
              placeholder="Create a strong password"
              leftIcon="Lock"
              strength
              strengthScore={strength.score}
              strengthLabel={strength.label}
              strengthColor={strength.color}
              error={s2.formState.errors.password?.message}
              {...s2.register('password')}
            />
            <PasswordInput
              label="Confirm password"
              placeholder="Re-enter password"
              leftIcon="Lock"
              error={s2.formState.errors.confirmPassword?.message}
              {...s2.register('confirmPassword')}
            />
            <Checkbox
              checked={terms}
              onChange={(v) => { setTerms(v); s2.setValue('terms', v, { shouldValidate: true }); }}
              label="I agree to the Terms of Service and Privacy Policy"
            />
            {s2.formState.errors.terms && (
              <p className="-mt-2 text-xs font-medium text-danger">{s2.formState.errors.terms.message}</p>
            )}
            <div className="flex gap-3">
              <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} leftIcon="ArrowLeft">
                Back
              </Button>
              <Button type="submit" className="flex-1" size="lg" loading={loading} magnetic>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success"
            >
              <Check className="h-8 w-8" strokeWidth={3} />
            </motion.div>
            <h3 className="mt-5 text-xl font-bold text-ink">Account created!</h3>
            <p className="mt-1.5 text-sm text-ink-soft">Taking you to your dashboard…</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to={r.loginPath} className="font-semibold text-navy hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
