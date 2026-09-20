import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import useScrollSpy from '../../hooks/useScrollSpy';
import useShowArchived from '../../hooks/useShowArchived';

const BASE_NAV_ITEMS = [
  { id: 'landing', label: 'Home', section: true },
  { id: 'about', label: 'About', section: true },
  { id: 'resume', label: 'Resume', section: true },
  { id: 'writing', label: 'Writing', section: true },
  { id: 'speaking', label: 'Speaking', section: true },
];

const ARCHIVED_NAV_ITEM = { id: 'projects', label: 'Projects', section: true };

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const showArchived = useShowArchived();

  const NAV_ITEMS = showArchived
    ? [BASE_NAV_ITEMS[0], BASE_NAV_ITEMS[1], ARCHIVED_NAV_ITEM, ...BASE_NAV_ITEMS.slice(2)]
    : BASE_NAV_ITEMS;

  const sectionIds = isHome ? NAV_ITEMS.filter(i => i.section).map(i => i.id) : [];
  const activeSection = useScrollSpy(sectionIds);

  const getActiveId = () => {
    if (isHome) return activeSection || 'landing';
    const path = location.pathname.slice(1);
    return path || 'landing';
  };

  const activeId = getActiveId();

  const handleSectionClick = useCallback((e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    const scrollTo = () => {
      if (id === 'landing') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    if (isHome) {
      scrollTo();
    } else {
      navigate('/');
      setTimeout(scrollTo, 100);
    }
  }, [isHome, navigate]);

  const linkClasses = (id) => {
    const isActive = activeId === id;
    return `text-xs tracking-widest uppercase transition-colors duration-200 ${
      isActive
        ? 'text-brand-400'
        : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-center h-12">
        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={linkClasses(item.id)}
                onClick={(e) => handleSectionClick(e, item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center justify-end w-full">
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-white hover:text-brand-300 transition-colors"
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <ul className="py-2">
            {NAV_ITEMS.map(item => (
              <li key={`m-${item.id}`}>
                <a
                  href={`#${item.id}`}
                  className={`block px-4 py-3 text-sm ${
                    activeId === item.id
                      ? 'text-brand-300 bg-white/5'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  } transition-colors`}
                  onClick={(e) => handleSectionClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
