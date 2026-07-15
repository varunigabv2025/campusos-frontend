import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Award, Target, Zap, Star, CalendarDays, MapPin, Briefcase, CheckCircle2, Trophy, Upload, Link2, Palette } from 'lucide-react';
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

const coverThemes = {
  navy: { type: 'gradient', label: 'Classic navy', className: 'from-navy via-navy-600 to-navy-400' },
  violet: { type: 'gradient', label: 'Violet haze', className: 'from-violet-800 via-violet-600 to-indigo-400' },
  emerald: { type: 'gradient', label: 'Emerald', className: 'from-emerald-800 via-teal-600 to-cyan-400' },
  sunset: { type: 'gradient', label: 'Sunset', className: 'from-rose-700 via-orange-500 to-amber-300' },
  tech: { type: 'image', label: 'Technology', url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600' },
  design: { type: 'image', label: 'Creative Design', url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600' },
  campus: { type: 'image', label: 'Campus Life', url: 'https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&w=600' },
  abstract: { type: 'image', label: 'Abstract Flow', url: 'https://images.pexels.com/photos/1242348/pexels-photo-1242348.jpeg?auto=compress&cs=tinysrgb&w=600' },
} as const;

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

type CoverTab = 'themes' | 'upload' | 'url';

const coverTabs: { id: CoverTab; label: string; icon: typeof Upload }[] = [
  { id: 'themes', label: 'Themes', icon: Palette },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'url', label: 'URL', icon: Link2 },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [coverTab, setCoverTab] = useState<CoverTab>('themes');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [year, setYear] = useState(user?.year ?? '');
  const [club, setClub] = useState(user?.club ?? '');
  const [selectedCover, setSelectedCover] = useState<keyof typeof coverThemes>(user?.coverTheme ?? 'navy');
  const [customBannerUrl, setCustomBannerUrl] = useState(user?.coverImage ?? '');
  const [uploadedBanner, setUploadedBanner] = useState('');
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // Synchronize selected cover when opening the modal
  useEffect(() => {
    if (coverOpen) {
      setSelectedCover(user?.coverTheme ?? 'navy');
      setCustomBannerUrl(user?.coverImage ?? '');
      setUploadedBanner('');
      setCoverTab('themes');
    }
  }, [coverOpen, user?.coverTheme, user?.coverImage]);

  const handleBannerFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'error' }); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image must be under 5 MB', variant: 'error' }); return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedBanner(e.target?.result as string);
      setCustomBannerUrl('');
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    updateUser({ bio, department, year, club });
    setEditOpen(false);
    toast({ title: 'Profile updated', variant: 'success' });
  };


  const saveCover = () => {
    const uploadUrl = coverTab === 'upload' ? uploadedBanner : coverTab === 'url' ? customBannerUrl : '';
    if (uploadUrl) {
      updateUser({ coverTheme: 'navy', coverImage: uploadUrl });
      toast({ title: 'Cover updated', description: 'Your custom banner has been saved.', variant: 'success' });
    } else {
      updateUser({ coverTheme: selectedCover, coverImage: undefined });
      toast({ title: 'Cover updated', description: `${coverThemes[selectedCover].label} is now your profile cover.`, variant: 'success' });
    }
    setCoverOpen(false);
  };

  // Preview of the active cover for the modal
  const activeBannerPreview = coverTab === 'upload' ? uploadedBanner
    : coverTab === 'url' ? customBannerUrl
    : coverThemes[selectedCover]?.type === 'image' ? (coverThemes[selectedCover] as any).url
    : '';

  return (
    <div className="space-y-6">
      {/* Cover + avatar */}
      <FadeIn>
        <div className="overflow-hidden rounded-3xl border border-border-soft bg-white shadow-card">
          <div className="relative h-44 sm:h-56 overflow-hidden bg-navy">
            {user?.coverImage ? (
              <img src={user.coverImage} className="h-full w-full object-cover" alt="Profile Cover" />
            ) : coverThemes[user?.coverTheme ?? 'navy']?.type === 'image' ? (
              <img src={(coverThemes[user?.coverTheme ?? 'navy'] as any).url} className="h-full w-full object-cover" alt="Profile Cover" />
            ) : (
              <div className={`h-full w-full bg-gradient-to-r ${(coverThemes[user?.coverTheme ?? 'navy'] as any).className ?? (coverThemes.navy as any).className}`} />
            )}
            <div className="absolute inset-0 bg-navy-radial opacity-60" />
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-10 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl"
            />
            <button onClick={() => setCoverOpen(true)} className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/25">
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
            <label className="label-base">Department</label>
            <Dropdown value={department} options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} onChange={setDepartment} />
          </div>
          <div>
            <label className="label-base">Year</label>
            <Dropdown value={year} options={YEARS.map((y) => ({ value: y, label: y }))} onChange={setYear} />
          </div>
          <div>
            <label className="label-base">Bio</label>
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
      <Modal open={coverOpen} onClose={() => setCoverOpen(false)} title="Choose a cover" description="Customise your profile header banner" size="md">
        {/* Live banner preview strip */}
        {activeBannerPreview ? (
          <div className="mb-4 overflow-hidden rounded-2xl border border-border-soft/60 shadow-sm">
            <img src={activeBannerPreview} alt="Preview" className="h-24 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          </div>
        ) : (
          <div className={`mb-4 h-24 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${(coverThemes[selectedCover] as any).className ?? 'from-navy to-navy-400'} shadow-sm`} />
        )}

        {/* Tab switcher */}
        <div className="mb-4 flex gap-1.5 rounded-xl bg-cream-100/60 p-1">
          {coverTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCoverTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all duration-200 ${
                coverTab === tab.id ? 'bg-white text-navy shadow-sm' : 'text-ink-soft hover:text-navy'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Themes tab */}
        {coverTab === 'themes' && (
          <div className="grid grid-cols-4 gap-2.5">
            {Object.entries(coverThemes).map(([key, cover]) => {
              const isSelected = selectedCover === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCover(key as keyof typeof coverThemes)}
                  className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all duration-200 ${isSelected ? 'border-navy shadow-md ring-2 ring-navy/20' : 'border-border-soft hover:border-navy/40'}`}
                >
                  {cover.type === 'image' ? (
                    <img src={(cover as any).url} className="block h-14 w-full object-cover" alt={cover.label} />
                  ) : (
                    <span className={`block h-14 bg-gradient-to-br ${(cover as any).className}`} />
                  )}
                  {isSelected && (
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy shadow">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  )}
                  <span className="block truncate px-1.5 py-1.5 text-[0.65rem] font-semibold text-ink">{cover.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Upload tab */}
        {coverTab === 'upload' && (
          <div className="space-y-3">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsBannerDragging(true); }}
              onDragLeave={() => setIsBannerDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsBannerDragging(false); handleBannerFileChange(e.dataTransfer.files[0] ?? null); }}
              onClick={() => bannerFileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                isBannerDragging
                  ? 'border-navy bg-navy/5 scale-[1.01]'
                  : 'border-border-soft bg-cream-100/30 hover:border-navy/40 hover:bg-cream-100/60'
              }`}
            >
              {uploadedBanner ? (
                <>
                  <img src={uploadedBanner} alt="Uploaded" className="h-20 w-full rounded-xl object-cover shadow-md" />
                  <p className="text-xs font-semibold text-success">Banner uploaded!</p>
                  <p className="text-xs text-ink-soft">Click to change</p>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/8 text-navy">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">Drop your banner here</p>
                    <p className="mt-0.5 text-xs text-ink-soft">or click to browse from device</p>
                  </div>
                  <p className="text-[0.7rem] text-ink-soft/60">JPG, PNG, GIF — best at 1200×300px, max 5 MB</p>
                </>
              )}
            </div>
            <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerFileChange(e.target.files?.[0] ?? null)} />
            {uploadedBanner && (
              <Button variant="secondary" size="sm" onClick={() => setUploadedBanner('')} className="w-full">Remove banner</Button>
            )}
          </div>
        )}

        {/* URL tab */}
        {coverTab === 'url' && (
          <div className="space-y-3">
            <div>
              <label className="label-base">Paste banner image URL</label>
              <input
                type="text"
                className="input-base w-full"
                placeholder="https://images.pexels.com/... or similar"
                value={customBannerUrl}
                onChange={(e) => setCustomBannerUrl(e.target.value)}
              />
            </div>
            {customBannerUrl && (
              <div className="overflow-hidden rounded-xl border border-border-soft/60">
                <img src={customBannerUrl} alt="URL preview" className="h-24 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <p className="text-xs text-ink-soft">Paste a direct link to any publicly accessible image. Best dimensions: 1200 × 300 px.</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setCoverOpen(false)}>Cancel</Button>
          <Button className="flex-1" leftIcon="Check" onClick={saveCover}>Save cover</Button>
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
