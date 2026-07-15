import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, PenLine, ArrowLeft } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FadeIn, StaggerGroup, StaggerItem } from '../../components/ui/motion';
import { mockBlogPosts } from '../../utils/mockData';
import { useToast } from '../../context/ToastContext';

export default function BlogsPage() {
  const { toast } = useToast();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handleWritePost = () => {
    toast({
      title: 'Write Post',
      description: 'Blog creation interface is under development.',
      variant: 'info',
    });
  };

  if (selectedPost) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <FadeIn>
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </button>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="card-surface overflow-hidden">
            <img src={selectedPost.cover} alt="" className="h-64 sm:h-96 w-full object-cover" />
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-2">
                <Badge tone="navy">{selectedPost.readTime}</Badge>
                <span className="text-xs text-ink-soft">{selectedPost.date}</span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {selectedPost.title}
              </h1>
              <div className="mt-4 flex items-center gap-2.5 border-b border-border-soft pb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy font-bold text-sm">
                  {selectedPost.author[0]}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{selectedPost.author}</p>
                  <p className="text-xs text-ink-soft">Contributor</p>
                </div>
              </div>

              <div className="mt-6 space-y-6 text-base text-ink-soft/90 leading-relaxed">
                <p className="text-lg font-medium text-ink leading-relaxed">
                  {selectedPost.excerpt}
                </p>
                <p>
                  First and foremost, community-driven platforms succeed when they prioritize user experience above all else. In student organisations, the challenges are twofold: high turnover rates as senior students graduate, and varying technical expertise among new recruits. Having a solid design system and documentation in place mitigates these risks, making onboarding seamless.
                </p>
                <p>
                  Furthermore, treating our operations like product cycles helps structure the workflows. Instead of ad-hoc events, staging milestones with clear deliverables guarantees consistency. When team members have clear ownership, motivation naturally increases, leading to a much higher retention and contribution rate.
                </p>
                <p>
                  Lastly, we encourage cross-departmental collaboration. Designers, developers, and writers should not operate in silos. Regular syncs, open-source designs, and collaborative workshops foster a culture of shared learning and innovation. By building this foundation, we ensure the club thrives for years to come.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Blogs</h1>
            <p className="mt-1 text-sm text-ink-soft">Stories, guides, and insights from the community.</p>
          </div>
          <Button leftIcon="Plus" onClick={handleWritePost} magnetic>Write Post</Button>
        </div>
      </FadeIn>

      {/* Featured */}
      <FadeIn delay={0.08}>
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setSelectedPost(mockBlogPosts[0])}
          className="card-surface overflow-hidden transition-shadow hover:shadow-lift cursor-pointer"
        >
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
              <Button
                variant="secondary"
                className="mt-5"
                rightIcon="ArrowRight"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPost(mockBlogPosts[0]);
                }}
              >
                Read article
              </Button>
            </div>
          </div>
        </motion.div>
      </FadeIn>

      {/* Grid */}
      <StaggerGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockBlogPosts.slice(1).map((post) => (
          <StaggerItem key={post.id}>
            <motion.article
              whileHover={{ y: -6 }}
              onClick={() => setSelectedPost(post)}
              className="card-surface overflow-hidden transition-shadow hover:shadow-lift cursor-pointer flex flex-col h-full"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={post.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute left-3 top-3">
                  <Badge tone="sand">{post.readTime}</Badge>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold leading-snug text-ink">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
                </div>
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
