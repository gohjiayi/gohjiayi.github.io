import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import SocialLinks from '../shared/SocialLinks';

export default function Footer({ data }) {
  if (!data) return null;

  const social = data.social || {};
  const year = new Date().getFullYear();

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-900 dark:bg-black text-center py-12">
      <div className="max-w-5xl mx-auto px-6">
        <SocialLinks social={social} className="justify-center" />
        <p className="mt-4 text-sm text-gray-500">
          &copy; {year}{' '}
          <a
            href={social.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-400 transition-colors"
          >
            Goh Jia Yi, Jesa
          </a>
        </p>
      </div>

      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <button
          onClick={handleBackToTop}
          aria-label="Back to top"
          className="w-10 h-10 rounded-full bg-gray-700 text-white hover:bg-brand-500 transition-colors flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      </div>
    </footer>
  );
}
