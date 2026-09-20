import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function Landing({ data }) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  return (
    <section
      ref={sectionRef}
      id="landing"
      className={shouldReduceMotion ? 'h-screen' : 'h-[140vh]'}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <img
          src="/images/background.jpg"
          alt={data?.name || ''}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />

        <motion.div
          className="relative z-10 text-center px-6"
          style={shouldReduceMotion ? {} : { opacity: textOpacity, y: textY }}
        >
          <motion.h1
            className="text-[2.75rem] md:text-8xl font-display font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20, letterSpacing: '0.15em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '-0.01em' }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {data?.name || ''}
          </motion.h1>
          {data?.headline && (
            <motion.p
              className="mt-4 text-base md:text-lg text-gray-200 drop-shadow md:whitespace-nowrap"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            >
              {data.headline}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          style={shouldReduceMotion ? {} : { opacity: textOpacity }}
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-5 h-5 text-gray-300"
          />
        </motion.div>
      </div>
    </section>
  );
}
