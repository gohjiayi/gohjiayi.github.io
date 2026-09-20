import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default function PublicationCard({ publication }) {
  const { title, authors, venue, date, url } = publication;
  const hasUrl = url && url.trim() !== '';

  const Wrapper = hasUrl ? 'a' : 'div';
  const wrapperProps = hasUrl
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500 transition-all duration-200 p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
          {title}
        </h3>
        {hasUrl && (
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 shrink-0 mt-1 transition-colors"
          />
        )}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
        {authors.split(/(JY Goh)/).map((part, i) =>
          part === 'JY Goh' ? <span key={i} className="font-semibold text-gray-900 dark:text-white">{part}</span> : part
        )}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs font-medium text-sky-600 dark:text-sky-400">{venue}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
      </div>
    </Wrapper>
  );
}
