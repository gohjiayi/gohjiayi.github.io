import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.5,
  once = true,
  amount = 0.2,
  as = 'div',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const shouldReduceMotion = useReducedMotion();

  const directionOffset = { up: [24, 0], down: [-24, 0], left: [0, -24], right: [0, 24], none: [0, 0] };
  const [yOff, xOff] = directionOffset[direction] || directionOffset.up;

  const Component = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <Component
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: yOff, x: xOff }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yOff, x: xOff }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
}
