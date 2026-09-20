import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faMedium, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export default function SocialLinks({ social, className = '', size = 'md' }) {
  if (!social) return null;

  const items = [
    { key: 'linkedin', href: social.linkedin, icon: faLinkedin, label: 'LinkedIn' },
    { key: 'github', href: social.github, icon: faGithub, label: 'GitHub' },
    { key: 'x', href: social.x, icon: faXTwitter, label: 'X' },
    { key: 'medium', href: social.medium, icon: faMedium, label: 'Medium' },
    { key: 'scholar', href: social.googlescholar, icon: faGraduationCap, label: 'Google Scholar' },
  ].filter(i => i.href);

  const iconSize = size === 'sm' ? 'w-4 h-4 md:w-5 md:h-5' : 'w-5 h-5 md:w-6 md:h-6';
  const gap = size === 'sm' ? 'gap-2 md:gap-3' : 'gap-3 md:gap-4';

  return (
    <div className={`flex items-center ${gap} flex-wrap ${className}`}>
      {items.map(({ key, href, icon, label }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="p-2 rounded-full text-gray-400 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-300 hover:-translate-y-0.5 transition-all duration-200"
        >
          <FontAwesomeIcon icon={icon} className={iconSize} />
        </a>
      ))}
    </div>
  );
}
