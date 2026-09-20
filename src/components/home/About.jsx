import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import SocialLinks from '../shared/SocialLinks';
import FadeIn from '../shared/FadeIn';

export default function About({ data }) {
  if (!data) return null;

  const profileSrc = `images/${data.image}`;
  const resumeHref = `files/${data.resumedownload}`;
  const bio = data.bio || [];

  return (
    <section
      id="about"
      className="pt-20 pb-16 md:pt-24 md:pb-20 scroll-mt-20 bg-gray-800 dark:bg-gray-900"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
          <FadeIn direction="left" className="flex flex-col items-center shrink-0">
            <img
              src={profileSrc}
              alt="Goh Jia Yi, Jesa"
              className="w-36 h-36 rounded-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </FadeIn>
          <FadeIn delay={0.15}>
            <div>
              {bio.map((paragraph, i) => (
                <p key={i} className="text-white leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-200 hover:text-gray-900 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download Resume
              </a>
              <div className="mt-4">
                <SocialLinks social={data.social} className="justify-start" size="sm" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
