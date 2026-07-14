import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockGallery } from '../../utils/mockData';

export default function GalleryPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Gallery</h1>
            <p className="mt-1 text-sm text-ink-soft">Moments captured across club events.</p>
          </div>
          <Badge tone="navy">{mockGallery.length} photos</Badge>
        </div>
      </FadeIn>

      <StaggerGroup className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {mockGallery.map((src, i) => (
          <StaggerItem key={i}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActive(src)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border-soft shadow-card"
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${i % 3 === 0 ? 'h-60' : i % 3 === 1 ? 'h-44' : 'h-52'}`}
              />
              <div className="absolute inset-0 bg-navy-900/0 transition-colors duration-300 group-hover:bg-navy-900/20" />
            </motion.button>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-900/80 p-6 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={active}
              alt="Enlarged"
              className="max-h-[85vh] max-w-4xl rounded-2xl object-contain shadow-lift"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute top-6 right-6 flex gap-2">
              <a href={active} download target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                <Button variant="secondary" size="sm" leftIcon="Download">Download</Button>
              </a>
              <button
                onClick={() => setActive(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
