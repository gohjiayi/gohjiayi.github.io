import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SEO from '../layout/SEO';
import TalkCard from './TalkCard';

export default function SpeakingPage({ data }) {
  const navigate = useNavigate();
  const talks = Array.isArray(data) ? data : [];

  const grouped = useMemo(() => {
    const sorted = [...talks].sort((a, b) => new Date(b.date) - new Date(a.date));
    const groups = [];
    let currentYear = null;
    for (const talk of sorted) {
      const year = new Date(talk.date).getFullYear();
      if (year !== currentYear) {
        currentYear = year;
        groups.push({ year, items: [] });
      }
      groups[groups.length - 1].items.push(talk);
    }
    return groups;
  }, [talks]);

  return (
    <>
      <SEO title="Speaking" description="Talks and presentations by Goh Jia Yi" url="/speaking" />
      <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-10">
            <button
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('speaking')?.scrollIntoView({ behavior: 'instant' }), 100); }}
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors mb-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
              Back to home
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Speaking
            </h1>
          </div>

          {/* Talks */}
          {grouped.length > 0 ? (
            <div className="space-y-10">
              {grouped.map(({ year, items }) => (
                <div key={year}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{year}</h2>
                  <div className="space-y-4">
                    {items.map((talk, i) => (
                      <TalkCard key={`${talk.title}-${i}`} talk={talk} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No talks match this filter.</p>
          )}
        </div>
      </div>
    </>
  );
}
