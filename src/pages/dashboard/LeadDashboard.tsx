import { motion } from 'framer-motion';
import {
  Users, AlertCircle, TrendingUp,
  CalendarDays, Plus, Bell, Activity,
} from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { StatCard } from '../../components/ui/StatCard';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { useAuth } from '../../context/AuthContext';
import {
  mockLeadStats,
  mockClubMembers,
  mockPendingApprovals,
  mockRecentRegistrations,
  mockProjects,
  mockTimeline,
  mockTodayEvents,
  buildMockCalendar,
} from '../../utils/mockData';

const approvalTypeTone = {
  event:   'navy',
  budget:  'warning',
  project: 'success',
  member:  'sand',
} as const;

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function LeadDashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const calendar = buildMockCalendar();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-ink-soft">{greeting},</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {firstName} <span className="text-ink-soft/40">·</span>{' '}
              <span className="text-navy">Club Lead</span>
            </h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              {user?.club && <><span className="font-medium text-ink">{user.club}</span> · </>}
              {user?.teamSize ?? 24} members · {user?.department}
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" leftIcon="Megaphone" size="md">Announce</Button>
            <Button leftIcon="Plus" size="md" magnetic>Create Event</Button>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockLeadStats.map((stat, i) => (
          <StaggerItem key={stat.id}>
            <StatCard stat={stat} index={i} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left col */}
        <div className="space-y-6 lg:col-span-2">

          {/* Pending Approvals */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader
                title="Pending Approvals"
                subtitle="Items awaiting coordinator approval"
                action={<Badge tone="warning" dot>{mockPendingApprovals.length} pending</Badge>}
              />
              <div className="space-y-3">
                {mockPendingApprovals.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + i * 0.07 }}
                    className="flex items-center gap-4 rounded-xl border border-border-soft p-3.5 transition-all hover:border-warning/30 hover:bg-warning/[0.02]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/12 text-[#b07314]">
                      <AlertCircle className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{a.title}</p>
                      <p className="text-xs text-ink-soft">Submitted by {a.submittedBy} · {a.submittedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={approvalTypeTone[a.type]}>{a.type}</Badge>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Project Progress */}
          <FadeIn delay={0.14}>
            <Card>
              <CardHeader
                title="Project Progress"
                subtitle="Active club projects"
                action={<Button variant="ghost" size="sm" rightIcon="ArrowRight">View all</Button>}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {mockProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.06 }}
                    whileHover={{ y: -3 }}
                    className="rounded-xl border border-border-soft bg-white p-4 transition-shadow hover:shadow-card"
                  >
                    <div className="flex items-center justify-between">
                      <Badge tone={p.status === 'active' ? 'success' : p.status === 'review' ? 'warning' : p.status === 'planning' ? 'navy' : 'neutral'}>{p.status}</Badge>
                      <span className="text-xs text-ink-soft">{p.tag}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink">{p.name}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-ink-soft">{p.members} members</span>
                        <span className="font-semibold text-ink">{p.progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-beige">
                        <motion.div
                          className="h-full rounded-full bg-navy"
                          initial={{ width: 0 }}
                          animate={{ width: `${p.progress}%` }}
                          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Recent Registrations */}
          <FadeIn delay={0.18}>
            <Card>
              <CardHeader
                title="Recent Registrations"
                subtitle="Members who just registered for events"
              />
              <div className="space-y-2.5">
                {mockRecentRegistrations.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.22 + i * 0.07 }}
                    className="flex items-center gap-3 rounded-xl border border-border-soft p-3 transition-colors hover:bg-cream-100/50"
                  >
                    <Avatar name={r.name} src={r.avatarUrl} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{r.name}</p>
                      <p className="text-xs text-ink-soft">Registered for {r.event}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-soft">{r.time}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Activity Timeline */}
          <FadeIn delay={0.22}>
            <Card>
              <CardHeader title="Recent Activity" subtitle="What's been happening in your club" />
              <div className="relative space-y-5 pl-2">
                <div className="absolute bottom-2 left-[14px] top-2 w-px bg-border-soft" />
                {mockTimeline.map((t, i) => (
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

          {/* Analytics Cards */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Events this month', value: 6,   icon: CalendarDays, color: 'bg-navy/10 text-navy'       },
                { label: 'Members active',    value: 18,  icon: Users,        color: 'bg-success/12 text-success'  },
                { label: 'Blogs published',   value: 4,   icon: Bell,         color: 'bg-sand/30 text-[#8a6d3b]'  },
                { label: 'Points earned',     value: 320, icon: TrendingUp,   color: 'bg-warning/15 text-[#b07314]' },
              ].map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="card-surface p-4 transition-shadow hover:shadow-card"
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.color}`}>
                    <c.icon className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-xl font-bold text-ink">{c.value}</p>
                  <p className="text-xs text-ink-soft">{c.label}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Team Members */}
          <FadeIn delay={0.14}>
            <Card>
              <CardHeader
                title="Team Members"
                subtitle="Top active members"
                action={<Button variant="ghost" size="sm">Manage</Button>}
              />
              <div className="space-y-2.5">
                {mockClubMembers.slice(0, 4).map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <Avatar name={m.name} src={m.avatarUrl} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                      <p className="text-xs text-ink-soft">{m.role}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-navy">{m.points} pts</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border-soft pt-3">
                <div className="flex -space-x-2">
                  {mockClubMembers.slice(0, 4).map((m) => (
                    <Avatar key={m.id} name={m.name} src={m.avatarUrl} size="xs" ring />
                  ))}
                </div>
                <span className="text-xs text-ink-soft">+{(user?.teamSize ?? 24) - 4} more members</span>
              </div>
            </Card>
          </FadeIn>

          {/* Today's events */}
          <FadeIn delay={0.18}>
            <Card>
              <CardHeader title="Today's Events" />
              <div className="space-y-2.5">
                {mockTodayEvents.slice(0, 2).map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 + i * 0.07 }}
                    className="flex items-center gap-3 rounded-xl border border-border-soft p-3"
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-cream-200 py-1.5">
                      <span className="text-[0.7rem] font-medium text-ink-soft">{e.time.split(' ')[1]}</span>
                      <span className="text-sm font-bold text-navy">{e.time.split(' ')[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{e.title}</p>
                      <p className="text-xs text-ink-soft">{e.attendees} attending</p>
                    </div>
                  </motion.div>
                ))}
                <Button variant="secondary" className="w-full" size="sm" leftIcon="Plus">
                  Create new event
                </Button>
              </div>
            </Card>
          </FadeIn>

          {/* Calendar */}
          <FadeIn delay={0.22}>
            <Card>
              <CardHeader title="Calendar" subtitle={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[0.68rem] font-semibold text-ink-soft">
                {weekdays.map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendar.map((d, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08 }}
                    className={`relative flex aspect-square items-center justify-center rounded-lg text-xs transition-colors ${
                      d.inMonth ? 'text-ink' : 'text-ink-soft/30'
                    } ${d.isToday ? 'bg-navy font-bold text-white' : d.events > 0 ? 'cursor-pointer font-semibold text-navy hover:bg-navy/10' : 'hover:bg-cream-200'}`}
                  >
                    {d.day || ''}
                    {d.events > 0 && !d.isToday && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-navy" />
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Quick Actions */}
          <FadeIn delay={0.26}>
            <Card>
              <CardHeader title="Quick Actions" />
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'New Event',    icon: 'CalendarDays', tone: 'navy'    },
                  { label: 'Announce',     icon: 'Megaphone',    tone: 'sand'    },
                  { label: 'Add Member',   icon: 'Users',        tone: 'success' },
                  { label: 'New Project',  icon: 'FolderKanban', tone: 'warning' },
                ].map((a, i) => (
                  <motion.button
                    key={a.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -3 }}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border-soft bg-cream-100/40 p-3.5 text-center transition-all hover:border-navy/20 hover:bg-white hover:shadow-soft"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      a.tone === 'navy' ? 'bg-navy/10 text-navy' :
                      a.tone === 'success' ? 'bg-success/12 text-success' :
                      a.tone === 'sand' ? 'bg-sand/30 text-[#8a6d3b]' :
                      'bg-warning/15 text-[#b07314]'
                    }`}>
                      <Plus className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold text-ink">{a.label}</span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
