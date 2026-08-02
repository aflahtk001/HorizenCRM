'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 1200,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const animate = () => {
      startTimeRef.current = null;
      const step = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setCount(Math.round(eased * end));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
