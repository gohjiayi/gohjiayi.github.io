import { useState, useEffect, useRef } from 'react';

export default function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0] || '');
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    if (!idsRef.current.length) return;

    let ticking = false;

    const calc = () => {
      const sectionIds = idsRef.current;
      const offset = 100;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (atBottom && sectionIds.length > 0) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        ticking = false;
        return;
      }

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - offset) {
          current = id;
        }
      }
      setActiveId(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calc);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    calc();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return activeId;
}
