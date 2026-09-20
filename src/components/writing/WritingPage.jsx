import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SEO from '../layout/SEO';
import ArticleCard from './ArticleCard';
import PublicationCard from './PublicationCard';

export default function WritingPage({ data }) {
  const navigate = useNavigate();
  const authored = data?.authored || [];
  const publications = data?.publications || [];

  const grouped = useMemo(() => {
    const sorted = [...authored].sort((a, b) => new Date(b.date) - new Date(a.date));
    const groups = [];
    let currentYear = null;
    for (const article of sorted) {
      const year = new Date(article.date).getFullYear();
      if (year !== currentYear) {
        currentYear = year;
        groups.push({ year, items: [] });
      }
      groups[groups.length - 1].items.push(article);
    }
    return groups;
  }, [authored]);

  return (
    <>
      <SEO title="Writing" description="Articles by Goh Jia Yi" url="/writing" />
      <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-10">
            <button
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('writing')?.scrollIntoView({ behavior: 'instant' }), 100); }}
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors mb-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
              Back to home
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Writing
            </h1>
          </div>

          {/* Articles */}
          {grouped.length > 0 ? (
            <div className="space-y-10">
              {grouped.map(({ year, items }) => (
                <div key={year}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{year}</h2>
                  <div className="space-y-4">
                    {items.map((article, i) => (
                      <ArticleCard key={`${article.title}-${i}`} article={article} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No articles match this filter.</p>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <span className="border-b-[3px] border-brand-500 pb-1">Publications</span>
              </h2>
              <div className="space-y-4">
                {publications.map((pub, i) => (
                  <PublicationCard key={`${pub.title}-${i}`} publication={pub} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
