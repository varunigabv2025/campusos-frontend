import { motion } from 'framer-motion';
import { Clock, PenLine } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { mockBlogPosts } from '../../utils/mockData';

export default function BlogsPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Blogs</h1>
            <p className="mt-1 text-sm text-ink-soft">Stories, guides, and insights from the community.</p>
          </div>
          <Button leftIcon="Plus" magnetic>Write Post</Button>
        </div>
      </FadeIn>

      {/* Featured */}
      <FadeIn delay={0.08}>
        <motion.div whileHover={{ y: -4 }} className="card-surface overflow-hidden transition-shadow hover:shadow-lift">
          <div className="grid md:grid-cols-2">
            <div className="relative h-56 overflow-hidden bg-navy md:h-auto">
              <img src={mockBlogPosts[0].cover} alt="" className="h-full w-full object-cover" />
              <div className="absolute left-4 top-4">
                <Badge tone="navy" dot>Featured</Badge>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8a6d3b]">Editor's pick</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-ink">{mockBlogPosts[0].title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{mockBlogPosts[0].excerpt}</p>
              <div className="mt-5 flex items-center gap-3 text-xs text-ink-soft">
                <span className="font-semibold text-ink">{mockBlogPosts[0].author}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {mockBlogPosts[0].readTime}</span>
                <span>·</span>
                <span>{mockBlogPosts[0].date}</span>
              </div>
              <Button variant="secondary" className="mt-5" rightIcon="ArrowRight" size="sm">Read article</Button>
            </div>
          </div>
        </motion.div>
      </FadeIn>

      {/* Grid */}
      <StaggerGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockBlogPosts.slice(1).map((post) => (
          <StaggerItem key={post.id}>
            <motion.article whileHover={{ y: -6 }} className="card-surface overflow-hidden transition-shadow hover:shadow-lift">
              <div className="relative h-44 overflow-hidden">
                <img src={post.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute left-3 top-3">
                  <Badge tone="sand">{post.readTime}</Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold leading-snug text-ink">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink">
                    <PenLine className="h-3.5 w-3.5 text-navy" /> {post.author}
                  </span>
                  <span className="text-xs text-ink-soft">{post.date}</span>
                </div>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
