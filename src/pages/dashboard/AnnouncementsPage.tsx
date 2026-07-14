import { motion } from 'framer-motion';
import { Megaphone, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { mockAnnouncements } from '../../utils/mockData';

const priorityTone = {
  high: 'danger',
  normal: 'warning',
  low: 'neutral',
} as const;

const priorityDot = {
  high: 'bg-danger',
  normal: 'bg-warning',
  low: 'bg-ink-soft/40',
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Announcements</h1>
            <p className="mt-1 text-sm text-ink-soft">Stay up to date with what's happening.</p>
          </div>
          <Button leftIcon="Plus" magnetic>New Announcement</Button>
        </div>
      </FadeIn>

      <StaggerGroup className="space-y-4">
        {mockAnnouncements.map((a) => (
          <StaggerItem key={a.id}>
            <motion.div whileHover={{ y: -3 }} className="card-surface p-5 transition-shadow hover:shadow-lift">
              <div className="flex items-start gap-4">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  a.priority === 'high' ? 'bg-danger/10 text-danger' : a.priority === 'normal' ? 'bg-warning/15 text-[#b07314]' : 'bg-navy/10 text-navy'
                }`}>
                  <Megaphone className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[a.priority]}`} />
                    <h3 className="text-base font-semibold text-ink">{a.title}</h3>
                    <Badge tone={priorityTone[a.priority]}>{a.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.body}</p>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-border-soft pt-3">
                    <Avatar name={a.author} size="xs" />
                    <span className="text-xs font-medium text-ink">{a.author}</span>
                    <span className="text-xs text-ink-soft">· {a.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <FadeIn delay={0.1}>
        <div className="flex items-center gap-3 rounded-2xl border border-border-soft bg-cream-100/50 p-4 text-sm text-ink-soft">
          <AlertCircle className="h-5 w-5 shrink-0 text-navy" />
          Announcements older than 30 days are archived automatically.
        </div>
      </FadeIn>
    </div>
  );
}
