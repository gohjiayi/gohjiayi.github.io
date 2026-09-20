import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPaperclip } from '@fortawesome/free-solid-svg-icons';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function TalkCard({ talk }) {
  const { title, type, event, date, summary, url, slidesUrl, image } = talk;
  const hasImage = image && image.trim() !== '';
  const hasRecording = url && url.trim() !== '';
  const hasSlides = slidesUrl && slidesUrl.trim() !== '';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500 transition-all duration-200">
      <div className={`flex flex-col ${hasImage ? 'sm:flex-row' : ''}`}>
        {hasImage && (
          <div className="sm:w-48 shrink-0">
            <div className="aspect-video sm:aspect-auto sm:h-full">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="p-4 flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">{event}</span>
            {type && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                {type}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
          </div>
          {summary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
              {summary}
            </p>
          )}
          {(hasRecording || hasSlides) && (
            <div className="flex gap-3 mt-3">
              {hasRecording && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center group-hover:bg-brand-500 group-hover:-translate-y-0.5 transition-all duration-200">
                    <FontAwesomeIcon icon={faVideo} className="w-3 h-3" />
                  </span>
                  <span className="text-xs">Recording</span>
                </a>
              )}
              {hasSlides && (
                <a
                  href={slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center group-hover:bg-brand-500 group-hover:-translate-y-0.5 transition-all duration-200">
                    <FontAwesomeIcon icon={faPaperclip} className="w-3 h-3" />
                  </span>
                  <span className="text-xs">Slides</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
