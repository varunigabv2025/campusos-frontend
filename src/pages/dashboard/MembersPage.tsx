import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, UserX, UserCheck, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { Avatar } from '../../components/ui/Avatar';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { useToast } from '../../context/ToastContext';
import { mockClubMembers } from '../../utils/mockData';

export default function MembersPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState(mockClubMembers);
  const [query, setQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const handleStatusToggle = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );
    toast({
      title: 'Status Updated',
      description: `${name} has been ${nextStatus === 'active' ? 'activated' : 'deactivated'}.`,
      variant: nextStatus === 'active' ? 'success' : 'warning',
    });
  };

  const handleAddMember = () => {
    toast({
      title: 'Add Member',
      description: 'Form to invite or add members is under development.',
      variant: 'info',
    });
  };

  const filtered = members.filter((m) => {
    const matchesQuery = m.name.toLowerCase().includes(query.toLowerCase()) || m.role.toLowerCase().includes(query.toLowerCase());
    const matchesDept = filterDept === 'All' || m.department === filterDept;
    return matchesQuery && matchesDept;
  });

  const depts = ['All', ...Array.from(new Set(members.map((m) => m.department)))];

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Club Members</h1>
            <p className="mt-1.5 text-sm text-ink-soft">Review and coordinate student membership details, roles, and status.</p>
          </div>
          <Button leftIcon="Plus" onClick={handleAddMember} magnetic>Add Member</Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-2">
          <SearchBar value={query} onChange={setQuery} placeholder="Search members by name or role…" className="w-full md:max-w-sm" />
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {depts.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                  filterDept === dept
                    ? 'bg-navy text-white shadow-lift'
                    : 'bg-white text-ink-soft border border-border-soft hover:bg-cream-100/50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((m) => (
            <StaggerItem key={m.id}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="card-surface p-6 flex flex-col justify-between h-full transition-all duration-200 hover:shadow-lift"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <Avatar name={m.name} src={m.avatarUrl} size="lg" ring />
                    <Badge tone={m.status === 'active' ? 'success' : 'neutral'}>
                      {m.status}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-ink leading-snug">{m.name}</h3>
                    <p className="text-sm font-medium text-navy/80 mt-0.5">{m.role}</p>
                    <div className="mt-3 space-y-1 text-xs text-ink-soft/80">
                      <p>Joined · <span className="font-semibold text-ink-soft">{m.joinedDate}</span></p>
                      <p>Department · <span className="font-semibold text-ink-soft">{m.department}</span></p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border-soft/60 pt-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-navy" />
                    <span className="text-sm font-bold text-navy">{m.points} points</span>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(m.id, m.name, m.status)}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border border-border-soft transition-all duration-200 hover:bg-cream-100 ${
                      m.status === 'active' ? 'text-danger hover:border-danger/40 hover:bg-danger/5' : 'text-success hover:border-success/40 hover:bg-success/5'
                    }`}
                  >
                    {m.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
            </StaggerItem>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-soft p-12 text-center bg-white/50 col-span-3">
            <AlertCircle className="h-8 w-8 text-ink-soft/40" />
            <p className="mt-2 text-sm font-semibold text-ink">No members found</p>
            <p className="text-xs text-ink-soft">Adjust filters or search parameters.</p>
          </div>
        )}
      </StaggerGroup>
    </div>
  );
}
