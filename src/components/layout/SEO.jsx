import { useEffect } from 'react';

const BASE_URL = 'https://gohjiayi.github.io';
const DEFAULT_TITLE = 'Goh Jia Yi, Jesa';
const DEFAULT_DESC = 'Applied AI engineer focused on LLM safety, evaluation, and guardrails.';
const DEFAULT_IMAGE = `${BASE_URL}/images/profile.jpg`;

export default function SEO({ title, description, url, image }) {
  const fullTitle = title ? `${title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', ogImage);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
  }, [fullTitle, desc, pageUrl, ogImage]);

  return null;
}
