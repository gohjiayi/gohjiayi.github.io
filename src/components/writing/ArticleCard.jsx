import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function ArticleCard({ article }) {
  const { title, date, summary, url, image, archived } = article;
  const hasImage = image && image.trim() !== '';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500 transition-all duration-200"
    >
      {/* Mobile: tiny thumbnail + text */}
      <div className="flex sm:hidden flex-row p-4 gap-3">
        {hasImage && (
          <div className="shrink-0 mt-0.5">
            <img src={image} alt="" className="w-10 h-10 rounded object-cover" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
              {title}
            </h3>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 shrink-0 mt-1 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
            {archived && (
              <span className="bg-gray-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded opacity-80">
                Archived
              </span>
            )}
          </div>
          {summary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </div>
      {/* Desktop: image left + text right */}
      <div className={`hidden sm:flex flex-col ${hasImage ? 'sm:flex-row' : ''}`}>
        {hasImage && (
          <div className="sm:w-48 shrink-0">
            <div className="aspect-video">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
              {title}
            </h3>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 shrink-0 mt-1 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
            {archived && (
              <span className="bg-gray-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded opacity-80">
                Archived
              </span>
            )}
          </div>
          {summary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
