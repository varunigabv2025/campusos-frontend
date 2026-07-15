import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export interface EventActionDetails {
  id?: string | number;
  title: string;
  date?: string;
  time: string;
  location: string;
  attendees: number;
  status?: string;
}

export function EventActionModal({ event, onClose }: { event: EventActionDetails | null; onClose: () => void }) {
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<'in-person' | 'online'>('in-person');
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setAttendance('in-person');
    if (!event) return;

    const registrations = JSON.parse(
      localStorage.getItem("registeredEvents") || "[]"
    );
    const eventKey = String(event.id || event.title);
    setRegistered(registrations.includes(eventKey));
  }, [event]);

  if (!event) return null;

  const joining = event.status === 'live';
  const confirm = () => {
    const eventKey = String(event.id || event.title);
    const registrations = JSON.parse(
      localStorage.getItem("registeredEvents") || "[]"
    );

    if (!registrations.includes(eventKey)) {
      registrations.push(eventKey);
      localStorage.setItem("registeredEvents", JSON.stringify(registrations));
      setRegistered(true);

      // Trigger custom window event to notify other components to refresh
      window.dispatchEvent(new Event("campusos_event_registered"));
    }

    toast({
      title: joining ? `You're joining ${event.title}` : `Registered successfully!`,
      description: attendance === 'online' ? 'We will send your joining details shortly.' : 'Your place has been reserved.',
      variant: 'success',
    });
    onClose();
  };

  return (
    <Modal open={Boolean(event)} onClose={onClose} title={joining ? 'Join this live event' : 'Register for this event'} description={event.title} size="md">
      <div className="space-y-5">
        <div className="rounded-xl bg-cream-100/70 p-4 text-sm text-ink-soft">
          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-navy" /> {event.date && `${event.date} · `}{event.time}</div>
          <div className="mt-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-navy" /> {event.location}</div>
          <div className="mt-2 flex items-center gap-2"><Users className="h-4 w-4 text-navy" /> {event.attendees} people attending</div>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold text-ink">How will you attend?</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {[{ value: 'in-person' as const, label: 'In person', description: 'Attend at the venue' }, { value: 'online' as const, label: 'Online', description: 'Receive a joining link' }].map((option) => (
              <button type="button" key={option.value} onClick={() => setAttendance(option.value)} className={`rounded-xl border p-3 text-left transition-colors ${attendance === option.value ? 'border-navy bg-navy/5 ring-1 ring-navy/20' : 'border-border-soft hover:border-navy/30'}`}>
                <span className="block text-sm font-semibold text-ink">{option.label}</span>
                <span className="mt-0.5 block text-xs text-ink-soft">{option.description}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button leftIcon={registered ? "Check" : "Check"} disabled={registered && !joining} onClick={confirm}>
            {joining ? 'Join event' : registered ? 'Registered' : 'Register'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
