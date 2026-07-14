import { motion } from 'framer-motion';
import {
  CheckCircle2, AlertCircle, Activity,
  BarChart3, FileText, Layers,
} from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { useAuth } from '../../context/AuthContext';
import {
  mockFacultyStats,
  mockClubOverviews,
  mockReports,
  mockFacultyTimeline,
  mockPendingApprovals,
} from '../../utils/mockData';

const reportStatusTone = {
  submitted: 'warning',
  reviewed:  'navy',
  approved:  'success',
} as const;

const reportTypeTone = {
  monthly:  'neutral',
  event:    'navy',
  budget:   'warning',
  activity: 'sand',
} as const;

export default function FacultyDashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-ink-soft">{greeting},</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {firstName} <span className="text-ink-soft/40">·</span>{' '}
              <span className="text-navy">Faculty Coordinator</span>
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              {user?.designation ?? 'Faculty Coordinator'} · {user?.department}
              {user?.overseesClubs && (
                <> · Overseeing <span className="font-medium text-ink">{user.overseesClubs.length} clubs</span></>
              )}
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" leftIcon="FileText" size="md">Reports</Button>
            <Button leftIcon="CheckSquare" size="md" magnetic>Review Approvals</Button>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockFacultyStats.map((stat, i) => (
          <StaggerItem key={stat.id}>
            <StatCard stat={stat} index={i} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left col */}
        <div className="space-y-6 lg:col-span-2">

          {/* Club Performance Overview */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader
                title="Club Performance Overview"
                subtitle="All clubs under your coordination"
                action={<Button variant="ghost" size="sm" rightIcon="ArrowRight">View all</Button>}
              />
              <div className="space-y-3">
                {mockClubOverviews.map((club, i) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + i * 0.06 }}
                    className="flex items-center gap-4 rounded-xl border border-border-soft p-3.5 transition-all hover:border-navy/20 hover:bg-white hover:shadow-soft"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-ink">{club.name}</p>
                        <Badge tone={club.status === 'active' ? 'success' : club.status === 'pending' ? 'warning' : 'neutral'}>{club.status}</Badge>
                      </div>
                      <p className="text-xs text-ink-soft">
                        Lead: {club.lead} · {club.members} members · {club.eventsThisMonth} events this month
                      </p>
                    </div>
                    <div className="hidden flex-col items-end gap-1 sm:flex">
                      <span className="text-sm font-bold text-ink">{club.performance}%</span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-beige">
                        <motion.div
                          className={`h-full rounded-full ${club.performance >= 85 ? 'bg-success' : club.performance >= 70 ? 'bg-navy' : 'bg-warning'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${club.performance}%` }}
                          transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Pending Approvals */}
          <FadeIn delay={0.14}>
            <Card>
              <CardHeader
                title="Pending Club Approvals"
                subtitle="Items requiring your review"
                action={<Badge tone="warning" dot>{mockPendingApprovals.length} pending</Badge>}
              />
              <div className="space-y-3">
                {mockPendingApprovals.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.07 }}
                    className="flex items-center gap-4 rounded-xl border border-border-soft p-3.5 transition-all hover:border-warning/30 hover:bg-warning/[0.02]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/12 text-[#b07314]">
                      <AlertCircle className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{a.title}</p>
                      <p className="text-xs text-ink-soft">From: {a.submittedBy} · {a.submittedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="warning">{a.type}</Badge>
                      <Button variant="secondary" size="sm" leftIcon="Check">Approve</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Recent Reports */}
          <FadeIn delay={0.18}>
            <Card>
              <CardHeader
                title="Recent Reports"
                subtitle="Submitted by clubs under your oversight"
                action={<Button variant="ghost" size="sm">View all</Button>}
              />
              <div className="space-y-3">
                {mockReports.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.22 + i * 0.06 }}
                    className="flex items-center gap-4 rounded-xl border border-border-soft p-3.5 transition-colors hover:bg-cream-100/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{r.title}</p>
                      <p className="text-xs text-ink-soft">{r.club} · {r.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={reportTypeTone[r.type]}>{r.type}</Badge>
                      <Badge tone={reportStatusTone[r.status]}>{r.status}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Activity Timeline */}
          <FadeIn delay={0.22}>
            <Card>
              <CardHeader title="Activity Timeline" subtitle="Recent actions across all clubs" />
              <div className="relative space-y-5 pl-2">
                <div className="absolute bottom-2 left-[14px] top-2 w-px bg-border-soft" />
                {mockFacultyTimeline.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.26 + i * 0.07 }}
                    className="relative flex gap-4"
                  >
                    <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy ring-4 ring-cream">
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-sm font-semibold text-ink">{t.title}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">{t.description}</p>
                      <p className="mt-1 text-[0.7rem] text-ink-soft/70">{t.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>

        {/* Right col */}
        <div className="space-y-6">

          {/* Department overview */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader title="Department Overview" subtitle="Clubs by department" />
              <div className="space-y-3">
                {[
                  { dept: 'Computer Science', clubs: 3, members: 136, color: 'bg-navy' },
                  { dept: 'Design',           clubs: 2, members: 54,  color: 'bg-sand' },
                  { dept: 'Electronics',      clubs: 2, members: 80,  color: 'bg-success' },
                  { dept: 'Arts & Humanities',clubs: 3, members: 92,  color: 'bg-warning' },
                ].map((d, i) => (
                  <motion.div
                    key={d.dept}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`h-9 w-1 rounded-full ${d.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{d.dept}</p>
                      <p className="text-xs text-ink-soft">{d.clubs} clubs · {d.members} members</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Budget placeholder */}
          <FadeIn delay={0.14}>
            <Card>
              <CardHeader title="Budget Overview" subtitle="Current academic year" />
              <div className="space-y-3">
                {[
                  { label: 'Total Allocated', value: '₹2,40,000', pct: 100 },
                  { label: 'Spent',           value: '₹1,58,000', pct: 66  },
                  { label: 'Remaining',       value: '₹82,000',   pct: 34  },
                ].map((b, i) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink-soft">{b.label}</span>
                      <span className="font-semibold text-ink">{b.value}</span>
                    </div>
                    {i > 0 && (
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige">
                        <motion.div
                          className={`h-full rounded-full ${i === 1 ? 'bg-navy' : 'bg-success'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${b.pct}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <p className="mt-1 rounded-lg bg-cream-100 px-3 py-2 text-xs text-ink-soft">
                  Budget data is placeholder — connect your finance system for live figures.
                </p>
              </div>
            </Card>
          </FadeIn>

          {/* Quick actions */}
          <FadeIn delay={0.18}>
            <Card>
              <CardHeader title="Quick Actions" />
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Approve',     icon: CheckCircle2, color: 'bg-success/12 text-success'       },
                  { label: 'View Report', icon: FileText,     color: 'bg-navy/10 text-navy'             },
                  { label: 'All Clubs',   icon: Layers,       color: 'bg-sand/30 text-[#8a6d3b]'        },
                  { label: 'Analytics',   icon: BarChart3,    color: 'bg-warning/15 text-[#b07314]'     },
                ].map((a, i) => (
                  <motion.button
                    key={a.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -3 }}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border-soft bg-cream-100/40 p-3.5 text-center transition-all hover:border-navy/20 hover:bg-white hover:shadow-soft"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}>
                      <a.icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold text-ink">{a.label}</span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Clubs I oversee */}
          <FadeIn delay={0.22}>
            <Card>
              <CardHeader title="Clubs I Oversee" />
              <div className="space-y-2">
                {user?.overseesClubs?.map((club, i) => (
                  <motion.div
                    key={club}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.26 + i * 0.06 }}
                    className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-cream-100"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy/10 text-navy">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-medium text-ink">{club}</span>
                    <Badge tone="success" className="ml-auto">Active</Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
