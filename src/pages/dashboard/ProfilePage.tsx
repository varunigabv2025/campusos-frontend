import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Award, Target, Zap, Star, CalendarDays, MapPin, Briefcase, CheckCircle2, Trophy } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCountUp } from '../../hooks';
import { mockTimeline } from '../../utils/mockData';
import { DEPARTMENTS, YEARS } from '../../utils/constants';
import { Dropdown } from '../../components/ui/Dropdown';
import { formatDate } from '../../utils/cn';

const profileStats = [
  { id: 'p1', label: 'Events', value: 24, icon: CalendarDays },
  { id: 'p2', label: 'Projects', value: 8, icon: Target },
  { id: 'p3', label: 'Points', value: 1740, icon: Star },
  { id: 'p4', label: 'Badges', value: 4, icon: Award },
];

const timelineType = {
  event: { color: 'text-navy', bg: 'bg-navy/10' },
  project: { color: 'text-success', bg: 'bg-success/12' },
  announcement: { color: 'text-[#b07314]', bg: 'bg-warning/15' },
  meeting: { color: 'text-[#8a6d3b]', bg: 'bg-sand/30' },
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? '');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [year, setYear] = useState(user?.year ?? '');
  const [club, setClub] = useState(user?.club ?? '');

  const save = () => {
    updateUser({ bio, department, year, club });
    setEditOpen(false);
    toast({ title: 'Profile updated', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Cover + avatar */}
      <FadeIn>
        <div className="overflow-hidden rounded-3xl border border-border-soft bg-white shadow-card">
          <div className="relative h-44 bg-gradient-to-r from-navy via-navy-600 to-navy-400 sm:h-56">
            <div className="absolute inset-0 bg-navy-radial opacity-60" />
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-10 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl"
            />
            <button className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/25">
              <Edit3 className="h-3.5 w-3.5" /> Edit cover
            </button>
          </div>
          <div className="relative px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                >
                  <Avatar name={user?.name ?? 'User'} src={user?.avatarUrl} size="xl" ring className="shadow-lift" />
                </motion.div>
                <div className="pb-1">
                  <h1 className="text-xl font-bold text-ink sm:text-2xl">{user?.name}</h1>
                  <p className="text-sm text-ink-soft">{user?.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge tone="navy" dot>{user?.role}</Badge>
                    <Badge tone="sand">{user?.club}</Badge>
                    <Badge tone="neutral">{user?.department}</Badge>
                  </div>
                </div>
              </div>
              <Button variant="secondary" leftIcon="Edit3" onClick={() => setEditOpen(true)}>Edit Profile</Button>
            </div>

            {/* Bio */}
            {user?.bio && (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft">{user.bio}</p>
            )}

            {/* Meta */}
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {user?.department}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {user?.year}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {user?.club}</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {profileStats.map((s) => (
          <StaggerItem key={s.id}>
            <ProfileStat {...s} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: skills + certificates */}
        <div className="space-y-6">
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader title="Skills" />
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft bg-cream-100/50 px-3 py-1.5 text-xs font-medium text-ink"
                  >
                    <Zap className="h-3 w-3 text-navy" /> {skill}
                  </motion.span>
                ))}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card>
              <CardHeader title="Certificates" />
              <div className="space-y-3">
                {user?.certificates?.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border border-border-soft p-3 transition-colors hover:bg-cream-100/50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/12 text-success">
                      <Award className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{c.title}</p>
                      <p className="text-xs text-ink-soft">{c.issuer} · {formatDate(c.date)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>

        {/* Center: achievements + timeline */}
        <div className="space-y-6 lg:col-span-2">
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader title="Achievements" subtitle="Milestones earned through contribution" />
              <div className="grid gap-3 sm:grid-cols-2">
                {user?.achievements?.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                    className="rounded-xl border border-border-soft bg-gradient-to-br from-white to-cream-100/40 p-4 transition-shadow hover:shadow-card"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy">
                        <Trophy className="h-4 w-4" />
                      </span>
                      <span className="text-[0.7rem] text-ink-soft">{formatDate(a.date)}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink">{a.title}</p>
                    <p className="mt-1 text-xs text-ink-soft">{a.description}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card>
              <CardHeader title="Activity Timeline" />
              <div className="relative space-y-5 pl-2">
                <div className="absolute bottom-2 left-[14px] top-2 w-px bg-border-soft" />
                {mockTimeline.map((t, i) => {
                  const c = timelineType[t.type];
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="relative flex gap-4"
                    >
                      <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${c.bg} ${c.color} ring-4 ring-cream`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-sm font-semibold text-ink">{t.title}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">{t.description}</p>
                        <p className="mt-1 text-[0.7rem] text-ink-soft/70">{t.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>

      {/* Badges strip */}
      <FadeIn delay={0.1}>
        <Card>
          <CardHeader title="Badges" subtitle="Recognition earned across the platform" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {user?.badges?.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border-soft bg-cream-100/40 p-4 text-center transition-shadow hover:shadow-soft"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-soft" style={{ backgroundColor: b.color }}>
                  <Award className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-ink">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </FadeIn>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" description="Update your profile information" size="md">
        <div className="space-y-4">
          <Input label="Club" value={club} onChange={(e) => setClub(e.target.value)} placeholder="Developers Club" />
          <div>
            <label className="mb-1.5 block text-[0.825rem] font-semibold text-ink">Department</label>
            <Dropdown value={department} options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} onChange={setDepartment} />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.825rem] font-semibold text-ink">Year</label>
            <Dropdown value={year} options={YEARS.map((y) => ({ value: y, label: y }))} onChange={setYear} />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.825rem] font-semibold text-ink">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="input-base resize-none"
              placeholder="Tell the community about yourself…"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={save} leftIcon="Check">Save changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProfileStat({ label, value, icon: IconCmp }: { label: string; value: number; icon: typeof Star }) {
  const v = useCountUp(value, 1200, true);
  return (
    <motion.div whileHover={{ y: -4 }} className="card-surface flex items-center gap-3.5 p-4 transition-shadow hover:shadow-lift">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/10 text-navy">
        <IconCmp className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold tracking-tight text-ink">{v.toLocaleString()}</p>
        <p className="text-xs text-ink-soft">{label}</p>
      </div>
    </motion.div>
  );
}

