import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SEO from './components/layout/SEO';

import Landing from './components/home/Landing';
import About from './components/home/About';
import Resume from './components/home/Resume';
import Projects from './components/home/Projects';
import WritingPreview from './components/home/WritingPreview';
import SpeakingPreview from './components/home/SpeakingPreview';
import WritingPage from './components/writing/WritingPage';
import SpeakingPage from './components/speaking/SpeakingPage';
import useShowArchived from './hooks/useShowArchived';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCode, faRocket, faCloud, faCube, faLayerGroup,
  faUserTie, faHandshake, faUserFriends,
  faSun, faMoon, faBars, faXmark, faChevronUp,
  faArrowUpRightFromSquare, faDownload,
  faMagnifyingGlassChart, faShieldHalved, faRobot, faGears, faFlask,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCode, faRocket, faCloud, faCube, faLayerGroup,
  faUserTie, faHandshake, faUserFriends,
  faSun, faMoon, faBars, faXmark, faChevronUp,
  faArrowUpRightFromSquare, faDownload,
  faMagnifyingGlassChart, faShieldHalved, faRobot, faGears, faFlask,
);

function HomePage({ data, resumeData, showcaseData, writingData, speakingData }) {
  const showArchived = useShowArchived();
  return (
    <>
      <SEO />
      <Landing data={data} />
      <About data={data} />
      <Resume data={resumeData} />
      {showArchived && <Projects data={showcaseData} />}
      <WritingPreview data={writingData} />
      <SpeakingPreview data={speakingData} />
    </>
  );
}



function stamp(items) {
  return items.map(i => ({ ...i, archived: true }));
}

function mergeArchivedData(base, archived) {
  const merged = { ...base };
  if (archived.resume?.work) {
    merged.resume = { ...merged.resume, work: [...(merged.resume?.work || []), ...stamp(archived.resume.work)] };
  }
  if (archived.showcase?.items) {
    merged.showcase = { ...merged.showcase, items: [...(merged.showcase?.items || []), ...stamp(archived.showcase.items)] };
  }
  if (archived.speaking) {
    merged.speaking = [...(merged.speaking || []), ...stamp(archived.speaking)];
  }
  if (archived.writing) {
    merged.writing = { ...merged.writing };
    if (archived.writing.authored) {
      merged.writing.authored = [...(merged.writing.authored || []), ...stamp(archived.writing.authored)];
    }
    if (archived.writing.publications) {
      merged.writing.publications = [...(merged.writing.publications || []), ...stamp(archived.writing.publications)];
    }
  }
  return merged;
}

export default function App() {
  const [data, setData] = useState({});
  const showArchived = useShowArchived();

  useEffect(() => {
    fetch('/resumeData.json', { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(async (baseData) => {
        if (!showArchived) return baseData;
        try {
          const res = await fetch('/archivedData.json', { cache: 'no-cache' });
          if (!res.ok) return baseData;
          const archived = await res.json();
          return mergeArchivedData(baseData, archived);
        } catch {
          return baseData;
        }
      })
      .then(setData)
      .catch(console.error);
  }, [showArchived]);

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<HomePage data={data.main} resumeData={data.resume} showcaseData={data.showcase} writingData={data.writing} speakingData={data.speaking} />} />
          <Route path="/writing" element={<WritingPage data={data.writing} />} />
          <Route path="/speaking" element={<SpeakingPage data={data.speaking} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer data={data.main} />
    </>
  );
}
