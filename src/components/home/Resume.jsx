import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FadeIn from '../shared/FadeIn';

function JobEntry({ job, index, isExpanded, onToggle, isLast }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center pt-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(192,37,89,0.15),0_0_14px_rgba(192,37,89,0.35)]" />
        {!isLast && (
          <div className="w-px flex-1 bg-gray-200 dark:bg-gray-600 mt-2" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <button
          onClick={onToggle}
          className="w-full text-left group flex items-start justify-between gap-3 cursor-pointer"
        >
          <div>
            <h3 className="text-base font-semibold group-hover:text-brand-500 transition-colors duration-200">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-brand-600 dark:text-brand-400">
                {job.company} &bull; {job.location} &bull; {job.years}
              </p>
              {job.archived && (
                <span className="bg-gray-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded opacity-80">
                  Archived
                </span>
              )}
            </div>
          </div>
          <motion.span
            className="mt-1 text-gray-400 dark:text-gray-500 shrink-0"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-2 space-y-1.5 list-disc pl-5 pb-1">
                {(job.description || []).map((line, j) => (
                  <li key={j} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Resume({ data }) {
  const [expandedJobs, setExpandedJobs] = useState(new Set([0]));
  if (!data) return null;

  const work = data.work || [];
  const education = data.education || [];
  const technicalSkills = data.technicalskills || [];
  const softSkills = data.softskills || [];
  const languages = data.languages || [];

  const toggleJob = (index) => {
    setExpandedJobs(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section
      id="resume"
      className="py-16 md:py-20 scroll-mt-20 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Experience */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 mb-10 items-baseline">
            <div>
              <h2 className="text-lg font-semibold">
                <span className="border-b-[3px] border-brand-500 pb-1">Experience</span>
              </h2>
            </div>
            <div className="md:col-span-3 space-y-10">
              {work.map((job, i) => (
                <FadeIn key={`${job.company}-${i}`} delay={i * 0.08}>
                  <JobEntry
                    job={job}
                    index={i}
                    isExpanded={expandedJobs.has(i)}
                    onToggle={() => toggleJob(i)}
                    isLast={i === work.length - 1}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        <hr className="my-6 border-gray-200 dark:border-gray-600" />

        {/* Education */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 mb-10 items-baseline">
            <div>
              <h2 className="text-lg font-semibold">
                <span className="border-b-[3px] border-brand-500 pb-1">Education</span>
              </h2>
            </div>
            <div className="md:col-span-3 space-y-8">
              {education.map((edu, i) => (
                <FadeIn key={edu.school} delay={i * 0.1}>
                  <div>
                    <h3 className="text-base font-semibold">{edu.school}</h3>
                    <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                      {edu.degree} &bull; {edu.graduated}
                    </p>
                    {edu.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{edu.description}</p>
                    )}
                    {edu.activities && (
                      <div className="mt-1 pl-4">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-400">Activities and Societies</p>
                        <ul className="list-disc pl-4">
                          {(Array.isArray(edu.activities) ? edu.activities : String(edu.activities).split(/;\s*/))
                            .map((activity, j) => (
                              <li key={j} className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{activity}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        <hr className="my-6 border-gray-200 dark:border-gray-600" />

        {/* Skills */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 items-baseline">
            <div>
              <h2 className="text-lg font-semibold">
                <span className="border-b-[3px] border-brand-500 pb-1">Skills</span>
              </h2>
            </div>
            <div className="md:col-span-3 space-y-6">
              <div>
                <h3 className="text-base font-semibold mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.map((s, i) => (
                    <FadeIn key={s.skill} delay={i * 0.05} direction="none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 md:gap-2 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium bg-pink-50 text-brand-700 border border-pink-100 dark:bg-brand-900/30 dark:text-brand-200 dark:border-brand-800 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-default">
                        <FontAwesomeIcon icon={['fas', s.icon]} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {s.skill}
                      </span>
                    </FadeIn>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">Core Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((s, i) => (
                    <FadeIn key={s.skill} delay={i * 0.05 + 0.15} direction="none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 md:gap-2 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium bg-pink-50 text-brand-700 border border-pink-100 dark:bg-brand-900/30 dark:text-brand-200 dark:border-brand-800 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-default">
                        <FontAwesomeIcon icon={['fas', s.icon]} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {s.skill}
                      </span>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {languages.length > 0 && (
          <>
            <hr className="my-6 border-gray-200 dark:border-gray-600" />

            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 items-baseline">
                <div>
                  <h2 className="text-lg font-semibold">
                    <span className="border-b-[3px] border-brand-500 pb-1">Languages</span>
                  </h2>
                </div>
                <div className="md:col-span-3">
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {languages.map((s, i) => {
                      const match = s.skill.match(/^(.+?)\s*\((.+)\)$/);
                      const name = match ? match[1] : s.skill;
                      const proficiency = match ? match[2] : null;
                      return (
                        <FadeIn key={s.skill} delay={i * 0.08} direction="none">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{name}</span>
                            {proficiency && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">{proficiency}</span>
                            )}
                          </div>
                        </FadeIn>
                      );
                    })}
                  </div>
                </div>
              </div>
            </FadeIn>
          </>
        )}
      </div>
    </section>
  );
}
