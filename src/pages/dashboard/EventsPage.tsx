import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Filter } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { mockEvents } from '../../utils/mockData';

const statusTone = {
  upcoming: 'navy',
  live: 'success',
  completed: 'neutral',
} as const;

const filters = ['All', 'Upcoming', 'Live', 'Completed'];

export default function EventsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = mockEvents.filter((e) => {
    const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || e.status === filter.toLowerCase();
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Events</h1>
            <p className="mt-1 text-sm text-ink-soft">Browse, register, and manage club events.</p>
          </div>
          <Button leftIcon="Plus" magnetic>Create Event</Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={query} onChange={setQuery} placeholder="Search events…" className="sm:max-w-xs" />
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-soft" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f ? 'bg-navy text-white shadow-soft' : 'bg-white text-ink-soft hover:text-navy'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      <StaggerGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => (
          <StaggerItem key={e.id}>
            <motion.div whileHover={{ y: -6 }} className="card-surface group overflow-hidden transition-shadow hover:shadow-lift">
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-navy to-navy-400">
                <div className="absolute inset-0 bg-navy-radial opacity-50" />
                <div className="absolute left-4 top-4">
                  <Badge tone={statusTone[e.status as keyof typeof statusTone]} dot>{e.status}</Badge>
                </div>
                <div className="absolute bottom-4 right-4 flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                  <span className="text-[0.65rem] font-medium leading-none">{e.date.split(' ')[0]}</span>
                  <span className="text-lg font-bold leading-tight">{e.date.split(' ')[1]}</span>
                </div>
              </div>
              <div className="p-5">
                <Badge tone="sand">{e.tag}</Badge>
                <h3 className="mt-2.5 text-base font-semibold text-ink">{e.title}</h3>
                <div className="mt-3 space-y-1.5 text-xs text-ink-soft">
                  <p className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {e.time}</p>
                  <p className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {e.location}</p>
                  <p className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {e.attendees} attending</p>
                </div>
                <Button variant="secondary" className="mt-4 w-full" size="sm">
                  {e.status === 'completed' ? 'View recap' : e.status === 'live' ? 'Join now' : 'Register'}
                </Button>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
