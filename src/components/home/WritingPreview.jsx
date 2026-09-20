import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../writing/ArticleCard';
import FadeIn from '../shared/FadeIn';

const PREVIEW_COUNT = 3;

export default function WritingPreview({ data }) {
  const authored = data?.authored || [];

  const latest = useMemo(
    () => [...authored].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, PREVIEW_COUNT),
    [authored]
  );

  if (latest.length === 0) return null;

  return (
    <section id="writing" className="py-16 md:py-20 scroll-mt-20 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Writing
            </h2>
            <div className="mt-2 w-10 h-0.5 bg-brand-500 rounded-full" />
          </div>
        </FadeIn>
        <div className="space-y-4">
          {latest.map((article, i) => (
            <FadeIn key={`${article.title}-${i}`} delay={i * 0.1}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
        {authored.length > PREVIEW_COUNT && (
          <FadeIn delay={0.3}>
            <div className="mt-6 text-center">
              <Link
                to="/writing"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-brand-500 dark:text-brand-300 border border-brand-500/30 dark:border-brand-400/30 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              >
                Read more
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
