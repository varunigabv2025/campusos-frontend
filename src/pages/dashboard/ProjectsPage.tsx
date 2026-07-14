import { motion } from 'framer-motion';
import { FolderKanban, Users, CalendarDays } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { mockProjects } from '../../utils/mockData';
import { useState } from 'react';

const statusTone = {
  active: 'success',
  review: 'warning',
  planning: 'navy',
  completed: 'neutral',
} as const;

export default function ProjectsPage() {
  const [query, setQuery] = useState('');
  const filtered = mockProjects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Projects</h1>
            <p className="mt-1 text-sm text-ink-soft">Track active and planned club projects.</p>
          </div>
          <Button leftIcon="Plus" magnetic>New Project</Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search projects…" className="sm:max-w-xs" />
      </FadeIn>

      <StaggerGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <StaggerItem key={p.id}>
            <motion.div whileHover={{ y: -6 }} className="card-surface p-5 transition-shadow hover:shadow-lift">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/10 text-navy">
                  <FolderKanban className="h-5 w-5" />
                </span>
                <Badge tone={statusTone[p.status]} dot>{p.status}</Badge>
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.description}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-soft">Progress</span>
                  <span className="font-semibold text-ink">{p.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-beige">
                  <motion.div
                    className="h-full rounded-full bg-navy"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-3 text-xs text-ink-soft">
                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {p.members} members</span>
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Due {p.dueDate}</span>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
