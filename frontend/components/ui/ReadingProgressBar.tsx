'use client';

import { useRef, useEffect } from 'react';
import './ReadingProgressBar.css';

export default function ReadingProgressBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current || !containerRef.current) return;

    const bar = barRef.current;
    const container = containerRef.current;
    let rafId: number;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const pct = total > 0 ? scrollTop / total : 0;
      bar.style.transform = `scaleX(${pct})`;
      container.setAttribute('aria-valuenow', String(Math.round(pct * 100)));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="reading-progress"
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div ref={barRef} className="reading-progress__bar" />
    </div>
  );
}
