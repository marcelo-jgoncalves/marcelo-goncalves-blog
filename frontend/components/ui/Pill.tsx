// Reusable mono tag/badge — see Pill.module.css for the rationale.

import type { ReactNode } from 'react';
import styles from './Pill.module.css';

interface PillProps {
  children: ReactNode;
  className?: string;
}

export default function Pill({ children, className }: PillProps) {
  return (
    <span className={`${styles.pill}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}
