import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, Crown, ShieldCheck, Users, Sparkles,
  CalendarDays, Trophy, FolderKanban, Megaphone, BarChart3,
} from 'lucide-react';
import { Input, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { AuroraBackground } from '../../components/layout/AuroraBackground';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, APP_NAME, APP_TAGLINE } from '../../utils/constants';
import type { Role } from '../../types';

// ─── Schema ──────────────────────────────────────────────────────────────────
const schema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

// ─── Role illustration configs ────────────────────────────────────────────────
const roleConfig = {
  member: {
    icon:     Users,
    headline: 'Belong. Contribute. Get recognized.',
    subline:  'Every event, project, and achievement — tracked in one place.',
    bullets: [
      { icon: CalendarDays, text: 'Discover and join events instantly'   },
      { icon: Trophy,       text: 'Earn badges and climb the leaderboard' },
      { icon: FolderKanban, text: 'Build a portfolio of real projects'    },
    ],
    bg: 'from-navy-800 via-navy to-navy-400',
  },
  lead: {
    icon:     Crown,
    headline: 'Lead your club like a product team.',
    subline:  'Manage events, coordinate members, and track momentum — all from one dashboard.',
    bullets: [
      { icon: CalendarDays, text: 'Create and manage club events'         },
      { icon: FolderKanban, text: 'Track projects and team progress'      },
      { icon: Megaphone,    text: 'Post announcements to your members'    },
    ],
    bg: 'from-navy via-navy-600 to-navy-300',
  },
  faculty: {
    icon:     ShieldCheck,
    headline: 'Full visibility. Guided mentorship.',
    subline:  'Oversee every club, approve proposals, and mentor the next generation of leaders.',
    bullets: [
      { icon: BarChart3,    text: 'Monitor club performance at a glance'  },
      { icon: Check,        text: 'Approve events, budgets, and reports'  },
      { icon: Users,        text: 'Guide student leads with direct access' },
    ],
    bg: 'from-navy-900 via-navy-700 to-navy-500',
  },
};

// ─── Google SVG ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
);

// ─── Floating card decorator ──────────────────────────────────────────────────
function FloatingCard({ label, icon: Icon, delay, x, y }: { label: string; icon: typeof CalendarDays; delay: number; x: string; y: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 180, damping: 18 }}
      style={{ position: 'absolute', left: x, top: y } as React.CSSProperties}
      className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/15 px-3 py-2 shadow-lg backdrop-blur-md"
    >
      <Icon className="h-4 w-4 text-white/90" />
      <span className="text-xs font-semibold text-white/90">{label}</span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LoginPage({ role }: { role: Role }) {
  const r = ROLES[role];
  const cfg = roleConfig[role];
  const RoleIcon = cfg.icon;

  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await login({ ...values, role, remember });
      toast({ title: 'Welcome back!', description: `Signed in as ${r.title}`, variant: 'success' });
      navigate(r.dashboardPath);
    } catch (err) {
      toast({ title: 'Sign in failed', description: (err as Error).message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const floatingCards = {
    member:  [
      { label: 'Hackathon Kickoff',    icon: CalendarDays, delay: 0.6, x: '8%',  y: '22%' },
      { label: 'Top Contributor',      icon: Trophy,       delay: 0.7, x: '12%', y: '62%' },
    ],
    lead:    [
      { label: '24 Team Members',      icon: Users,        delay: 0.6, x: '8%',  y: '22%' },
      { label: '3 Pending Approvals',  icon: Check,        delay: 0.7, x: '12%', y: '62%' },
    ],
    faculty: [
      { label: '12 Active Clubs',      icon: BarChart3,    delay: 0.6, x: '8%',  y: '22%' },
      { label: '7 Pending Reviews',    icon: ShieldCheck,  delay: 0.7, x: '12%', y: '62%' },
    ],
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">

      {/* ── Left panel — illustration ─────────────────────── */}
      <div className={`relative hidden overflow-hidden bg-gradient-to-br ${cfg.bg} lg:flex lg:flex-col lg:justify-between lg:p-12`}>
        <div className="absolute inset-0 bg-navy-radial opacity-60" />
        <AuroraBackground variant="dark" />

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative flex items-center gap-2.5 text-white"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">{APP_NAME}</p>
            <p className="text-xs text-white/60">{APP_TAGLINE}</p>
          </div>
        </motion.div>

        {/* Floating role badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring' }}
          className="absolute right-8 top-10 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur"
        >
          <RoleIcon className="h-3.5 w-3.5 text-white/80" />
          <span className="text-xs font-semibold text-white/80">{r.title}</span>
        </motion.div>

        {/* Centre content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-md text-white"
        >
          {/* Large icon */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-lift backdrop-blur-md">
            <RoleIcon className="h-10 w-10" />
          </div>

          <h2 className="text-balance text-3xl font-bold leading-snug">{cfg.headline}</h2>
          <p className="mt-3 text-base text-white/65">{cfg.subline}</p>

          <ul className="mt-8 space-y-4">
            {cfg.bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.09 }}
                className="flex items-center gap-3 text-white/80"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/12 backdrop-blur">
                  <b.icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm">{b.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Floating decoration cards */}
        {floatingCards[role].map((fc, i) => (
          <FloatingCard key={i} {...fc} />
        ))}

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="relative text-sm text-white/40"
        >
          {APP_NAME} · {APP_TAGLINE}
        </motion.p>
      </div>

      {/* ── Right panel — form ────────────────────────────── */}
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-10">
        <AuroraBackground />

        <div className="relative w-full max-w-md">
          {/* Back button */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          {/* Role switcher pills */}
          <div className="mb-5 flex items-center gap-1.5 rounded-xl border border-border-soft bg-white/70 p-1 backdrop-blur">
            {(['member', 'lead', 'faculty'] as Role[]).map((r) => (
              <Link
                key={r}
                to={ROLES[r].loginPath}
                className={`flex-1 rounded-lg py-1.5 text-center text-xs font-semibold capitalize transition-all ${
                  role === r
                    ? 'bg-navy text-white shadow-soft'
                    : 'text-ink-soft hover:text-navy'
                }`}
              >
                {r === 'faculty' ? 'Faculty' : r === 'lead' ? 'Lead' : 'Member'}
              </Link>
            ))}
          </div>

          {/* Glass card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="glass rounded-3xl p-8 shadow-lift"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${ROLES[role].gradient} text-white shadow-soft`}>
                  <RoleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-ink">Sign in</h1>
                  <p className="text-sm text-ink-soft">{r.title}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                Enter your credentials to access your workspace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@campusos.app"
                leftIcon="Mail"
                error={errors.email?.message}
                {...register('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                leftIcon="Lock"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <Checkbox checked={remember} onChange={setRemember} label="Remember me" />
                <a href="#" className="text-sm font-medium text-navy hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading} magnetic>
                {loading ? 'Signing in…' : `Sign in as ${r.title.split(' ')[0]}`}
              </Button>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-soft" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs font-medium text-ink-soft">or</span>
                </div>
              </div>

              {/* Google button — UI only, MERN-ready */}
              <button
                type="button"
                disabled
                title="Backend integration required"
                className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-border-soft bg-white px-5 py-3 text-sm font-semibold text-ink-soft opacity-60 shadow-soft transition-all hover:border-navy/20 hover:opacity-70 hover:shadow-card"
              >
                <GoogleIcon />
                Continue with Google
                <span className="ml-auto rounded-md bg-beige px-1.5 py-0.5 text-[0.65rem] font-medium text-ink-soft/70">
                  Soon
                </span>
              </button>
            </form>
          </motion.div>

          {/* Sign up link */}
          <AnimatePresence>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-sm text-ink-soft"
            >
              New to {APP_NAME}?{' '}
              <Link to={`/signup/${role}`} className="font-semibold text-navy hover:underline">
                Create an account
              </Link>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
