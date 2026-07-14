import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Check } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { FadeIn } from '../../components/ui/motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [active, setActive] = useState('profile');
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [notif, setNotif] = useState({ email: true, push: true, weekly: false, mentions: true });
  const [theme, setTheme] = useState('light');

  const saveProfile = () => {
    updateUser({ name, email });
    toast({ title: 'Settings saved', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage your account and preferences.</p>
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Tabs */}
        <FadeIn delay={0.06}>
          <nav className="flex gap-1.5 overflow-x-auto lg:flex-col">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active === s.id ? 'bg-navy text-white shadow-soft' : 'text-ink-soft hover:bg-cream-200 hover:text-navy'
                }`}
              >
                <s.icon className="h-4 w-4" /> {s.label}
              </button>
            ))}
          </nav>
        </FadeIn>

        {/* Content */}
        <div className="space-y-6">
          {active === 'profile' && (
            <FadeIn delay={0.08}>
              <Card>
                <CardHeader title="Profile Information" subtitle="Update your personal details" />
                <div className="flex items-center gap-4">
                  <Avatar name={user?.name ?? 'User'} src={user?.avatarUrl} size="lg" />
                  <div>
                    <Button variant="secondary" size="sm" leftIcon="Upload">Change photo</Button>
                    <p className="mt-1.5 text-xs text-ink-soft">JPG or PNG. Max 2MB.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input label="Department" defaultValue={user?.department} disabled />
                  <Input label="Year" defaultValue={user?.year} disabled />
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={saveProfile} leftIcon="Check">Save changes</Button>
                </div>
              </Card>
            </FadeIn>
          )}

          {active === 'notifications' && (
            <FadeIn delay={0.08}>
              <Card>
                <CardHeader title="Notification Preferences" subtitle="Choose what you want to hear about" />
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                    { key: 'push', label: 'Push notifications', desc: 'Get alerts in real time' },
                    { key: 'weekly', label: 'Weekly digest', desc: 'A summary of activity every Monday' },
                    { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between border-b border-border-soft pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-ink">{n.label}</p>
                        <p className="text-xs text-ink-soft">{n.desc}</p>
                      </div>
                      <Checkbox
                        checked={notif[n.key as keyof typeof notif]}
                        onChange={(v) => setNotif((prev) => ({ ...prev, [n.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>
          )}

          {active === 'security' && (
            <FadeIn delay={0.08}>
              <Card>
                <CardHeader title="Security" subtitle="Keep your account safe" />
                <div className="space-y-4">
                  <Input label="Current password" type="password" placeholder="••••••••" leftIcon="Lock" />
                  <Input label="New password" type="password" placeholder="••••••••" leftIcon="Lock" />
                  <Input label="Confirm new password" type="password" placeholder="••••••••" leftIcon="Lock" />
                  <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-cream-100/40 p-3">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-sm text-ink-soft">Two-factor authentication is</span>
                    <Badge tone="success" dot>Enabled</Badge>
                  </div>
                  <Button leftIcon="Check">Update password</Button>
                </div>
              </Card>
            </FadeIn>
          )}

          {active === 'appearance' && (
            <FadeIn delay={0.08}>
              <Card>
                <CardHeader title="Appearance" subtitle="Customize how CampusOS looks" />
                <p className="mb-3 text-sm font-semibold text-ink">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', preview: 'bg-cream' },
                    { id: 'warm', label: 'Warm', preview: 'bg-sand-cream' },
                    { id: 'navy', label: 'Navy', preview: 'bg-navy' },
                  ].map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ y: -3 }}
                      onClick={() => { setTheme(t.id); toast({ title: 'Theme updated', variant: 'success' }); }}
                      className={`overflow-hidden rounded-xl border-2 transition-colors ${theme === t.id ? 'border-navy' : 'border-border-soft'}`}
                    >
                      <div className={`h-16 ${t.preview}`} />
                      <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-ink">
                        {theme === t.id && <Check className="h-3 w-3 text-navy" />} {t.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
