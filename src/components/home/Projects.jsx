import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { faLink, faCode, faArrowUpRightFromSquare, faPaperclip, faVideo } from '@fortawesome/free-solid-svg-icons';
import FadeIn from '../shared/FadeIn';

function resolveImage(img) {
  if (!img) return null;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return img.startsWith('images/') ? img : `images/${img}`;
}

function getCategoryBadges(item) {
  let types = [];
  if (Array.isArray(item.types)) types = item.types;
  else if (Array.isArray(item.type)) types = item.type;
  else if (typeof item.type === 'string') types = item.type.split(',').map(s => s.trim());
  types = types.map(t => t.toLowerCase()).filter(Boolean);

  const colorMap = {
    project: 'bg-green-500',
    talk: 'bg-yellow-400',
    'tech talk': 'bg-yellow-400',
    hackathon: 'bg-orange-400',
  };
  const labelMap = {
    project: 'Project',
    talk: 'Tech Talk',
    'tech talk': 'Tech Talk',
    hackathon: 'Hackathon',
  };

  return types.map(t => ({
    label: labelMap[t] || t.charAt(0).toUpperCase() + t.slice(1),
    bg: colorMap[t] || 'bg-green-500',
  }));
}

function getLinkIcon(label, url) {
  const l = (label || '').toLowerCase();
  const u = (url || '').toLowerCase();
  if (l.includes('github') || u.includes('github.com')) return faGithub;
  if (l.includes('medium') || u.includes('medium.com')) return faMedium;
  if (l.includes('slide')) return faPaperclip;
  if (l.includes('video')) return faVideo;
  if (l.includes('code') || l.includes('repo') || l.includes('source')) return faCode;
  if (l.includes('demo') || l.includes('live')) return faArrowUpRightFromSquare;
  return faLink;
}

function ProjectCard({ item, idx }) {
  const src = resolveImage(item.image);
  const badges = getCategoryBadges(item);
  const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
  const links = Array.isArray(item.links) ? item.links : [];

  return (
    <FadeIn key={`${item.title}-${idx}`} delay={idx * 0.1}>
      <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-500 transition-all duration-200 overflow-hidden h-full">
        <div className="p-4">
          <div className="flex gap-1.5 mb-2">
            {badges.map((b, i) => (
              <span key={i} className={`${b.bg} text-white text-xs font-semibold px-2 py-0.5 rounded`}>
                {b.label}
              </span>
            ))}
            {item.archived && (
              <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-0.5 rounded opacity-80">
                Archived
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
          {item.date && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.date}</p>
          )}

          {item.summary && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{item.summary}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {links.map((lnk, i) => (
                <a
                  key={i}
                  href={lnk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center group-hover:bg-brand-500 group-hover:-translate-y-0.5 transition-all duration-200">
                    <FontAwesomeIcon icon={getLinkIcon(lnk.label, lnk.url)} className="w-3 h-3" />
                  </span>
                  <span className="text-xs group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                    {lnk.label || 'Link'}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export default function Projects({ data }) {
  if (!data) return null;

  const items = (Array.isArray(data.items) ? data.items : [])
    .sort((a, b) => {
      if (a.archived !== b.archived) return a.archived ? 1 : -1;
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <section
      id="projects"
      className="py-16 md:py-20 scroll-mt-20 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-lg font-semibold mb-6">
            <span className="border-b-[3px] border-brand-500 pb-1">Projects</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <ProjectCard key={`${item.title}-${idx}`} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
